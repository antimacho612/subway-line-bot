import { type MiddlewareConfig, messagingApi } from '@line/bot-sdk';
import { createApp } from './webhook';

import 'dotenv/config';

const PORT = process.env.PORT || 3000;

const clientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};

const middlewareConfig: MiddlewareConfig = {
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

const client = new messagingApi.MessagingApiClient(clientConfig);

const app = createApp(client, middlewareConfig);

app.listen(PORT, () => {
  console.log(`Application is live and listening on port ${PORT}`);
});
