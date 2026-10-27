import {
  JSONParseError,
  type MiddlewareConfig,
  type messagingApi,
  middleware,
  SignatureValidationFailed,
  type webhook,
} from '@line/bot-sdk';
import express, { type Application, type NextFunction, type Request, type Response } from 'express';
import { replyToFailure, replyToOtherMessage, replyToPostbackMessage, replyToTextMessage } from './reply';
import { parsePostbackDatetime } from './serviceDate';

export type ReplyClient = Pick<messagingApi.MessagingApiClient, 'replyMessage'>;

function createReplyMessage(event: webhook.MessageEvent | webhook.PostbackEvent): messagingApi.Message {
  if (event.type === 'message' && event.message.type === 'text') {
    return replyToTextMessage(event.message.text);
  }
  if (
    event.type === 'postback' &&
    event.postback.params &&
    'datetime' in event.postback.params &&
    event.postback.params.datetime
  ) {
    return replyToPostbackMessage(event.postback.data, parsePostbackDatetime(event.postback.params.datetime));
  }
  return replyToOtherMessage();
}

export async function reply(client: ReplyClient, event: webhook.Event): Promise<void> {
  if ((event.type !== 'message' && event.type !== 'postback') || !event.replyToken) {
    return;
  }

  // グループ・トークルームでは無関係な発言にも反応してしまうため、1:1 トーク以外は無視する
  if (event.source?.type !== 'user') {
    return;
  }

  let message: messagingApi.Message;
  try {
    message = createReplyMessage(event);
  } catch (err) {
    // replyToken はまだ有効なので、ユーザーには汎用メッセージを返す
    console.error('Failed to create reply message:', err);
    message = replyToFailure();
  }

  // replyMessage 自体の失敗は再送せず、呼び出し元でログに残すだけにする
  await client.replyMessage({
    replyToken: event.replyToken,
    messages: [message],
  });
}

export function createApp(client: ReplyClient, middlewareConfig: MiddlewareConfig): Application {
  const app = express();

  // Health check
  app.get('/', (_: Request, res: Response) => {
    res.status(200).json({
      status: 'success',
      message: 'Connected successfully!',
    });
  });

  // API Routing
  app.post('/webhook', middleware(middlewareConfig), async (req: Request, res: Response) => {
    const events: webhook.Event[] = Array.isArray(req.body?.events) ? req.body.events : [];

    const results = await Promise.allSettled(events.map((event) => reply(client, event)));
    for (const result of results) {
      if (result.status === 'rejected') {
        console.error('Failed to handle webhook event:', result.reason);
      }
    }

    // LINE は 200 以外だと再送・Webhook 無効化の原因になるため、処理失敗でも常に 200 を返す
    res.status(200).json({ status: 'success' });
  });

  app.use((err: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      next(err);
      return;
    }

    if (err instanceof SignatureValidationFailed) {
      res.status(401).json({ status: 'error', message: 'Invalid signature' });
      return;
    }

    if (err instanceof JSONParseError) {
      res.status(400).json({ status: 'error', message: 'Invalid JSON' });
      return;
    }

    console.error('Unhandled error:', err);
    res.status(500).json({ status: 'error' });
  });

  return app;
}
