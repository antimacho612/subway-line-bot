import { ClientConfig, MiddlewareConfig, middleware, messagingApi, WebhookEvent } from '@line/bot-sdk';
import express, { Application, Request, Response } from 'express';
import { replyToPostbackMessage, replyToTextMessage, replyToOtherMessage } from './reply';

import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

const client = new messagingApi.MessagingApiClient(clientConfig);

const app: Application = express();

const reply = async (event: WebhookEvent) => {
  if (event.type !== 'message' && event.type !== 'postback') return;

  let message;

  if (event.type === 'message' && event.message.type === 'text') {
    message = replyToTextMessage(event.message.text);
  } else if (event.type === 'postback' && event.postback.params && 'datetime' in event.postback.params && event.postback.params.datetime) {
    message = replyToPostbackMessage(event.postback.data, new Date(event.postback.params.datetime));
  } else {
    message = replyToOtherMessage();
  }

  await client.replyMessage({
    replyToken: event.replyToken as string,
    messages: [message],
  });
};

// Testing Routing
app.get('/', async (_: Request, res: Response): Promise<Response> => {
  return res.status(200).json({
    status: 'success',
    message: 'Connected successfully!',
  });
});

// API Routing
app.post('/webhook', middleware(middlewareConfig), async (req: Request, res: Response): Promise<Response> => {
  const events: WebhookEvent[] = req.body.events;

  const results = await Promise.all(
    events.map(async (event) => {
      try {
        await reply(event);
      } catch (e) {
        if (e instanceof Error) {
          console.error(e);
        }

        return res.status(500).json({ status: 'error' });
      }
    })
  );

  return res.status(200).json({
    status: 'success',
    results,
  });
});

app.listen(PORT, () => {
  console.log(`Application is live and listening on port ${PORT}`);
});
