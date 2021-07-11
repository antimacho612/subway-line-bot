// Load the package
import { Client, ClientConfig, MiddlewareConfig, middleware, WebhookEvent } from '@line/bot-sdk';
import express from 'express';
import reply from './reply'
require('dotenv').config();

// Read the ports from the process.env file
const PORT = process.env.PORT || 3000;

// Load the access token and channel secret from the .env file
const config: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};
const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
  channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

// Instantiate
const app: express.Express = express();
const client = new Client(config);

// Do routing
// Testing Routing
app.get('/', (_req: express.Request, res: express.Response): void => {
  res.send('Hello World');
});

// API Routing
app.post(
  '/api/line/message',
  middleware(middlewareConfig),
  async (req: express.Request, _res: express.Response): Promise<void> => {
    const events: WebhookEvent[] = req.body.events;

    events.map(
      async (event: WebhookEvent): Promise<void> => {
        try{
          await reply(client, event);
        } catch (err) {
          console.error(err);
        }
      }
    );
  }
);

// Start the server
app.listen(PORT, (): void => {
  console.log('http://localhost:3000');
});