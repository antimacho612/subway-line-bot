import { Client, WebhookEvent } from '@line/bot-sdk';
import { flexMessageTemplate } from './subway'

export default async (client: Client, event: WebhookEvent): Promise<void> => {
  try{
    if ((event.type !== 'message' || event.message.type !== 'text') && (event.type !== 'postback' || !event.postback.params?.datetime)) { return; }

    const { replyToken } = event;
    const flexMessage = flexMessageTemplate(event);

    await client.replyMessage(replyToken, flexMessage);
  } catch (err) {
    console.log(err);
  }
}