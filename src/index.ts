import { type MiddlewareConfig, messagingApi } from '@line/bot-sdk';
import { requireEnv } from './env';
import { createApp } from './webhook';

const PORT = process.env.PORT || 3000;

const clientConfig = {
  channelAccessToken: requireEnv('LINE_CHANNEL_ACCESS_TOKEN'),
};

const middlewareConfig: MiddlewareConfig = {
  channelSecret: requireEnv('LINE_CHANNEL_SECRET'),
};

const client = new messagingApi.MessagingApiClient(clientConfig);

const app = createApp(client, middlewareConfig);

if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
  });
}

export default app;
