import { Client, ClientConfig, MiddlewareConfig, middleware, WebhookEvent } from "@line/bot-sdk";
import express, { Request, Response } from "express";
import { replyToPostbackMessage, replyToTextMessage, relpyToOtherMessage } from "./reply";

require("dotenv").config();

const PORT = process.env.PORT || 3000;

const config: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
};

const middlewareConfig: MiddlewareConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || "",
  channelSecret: process.env.LINE_CHANNEL_SECRET || "",
};

const app = express();
const client = new Client(config);

const reply = async (client: Client, event: WebhookEvent) => {
  if (event.type !== "message" && event.type !== "postback") {
    return;
  }

  const { replyToken } = event;
  let message;

  if (event.type === "message" && event.message.type === "text") {
    message = replyToTextMessage(event.message.text);
  } else if (event.type === "postback" && event.postback.params && "datetime" in event.postback.params && event.postback.params.datetime) {
    message = replyToPostbackMessage(event.postback.data, new Date(event.postback.params.datetime));
  } else {
    message = relpyToOtherMessage();
  }

  await client.replyMessage(replyToken, message);
};

// Testing Routing
app.get("/", (_req: Request, res: Response): void => {
  res.sendStatus(200);
});

// API Routing
app.post("/webhook", middleware(middlewareConfig), async (req: Request, _res: Response): Promise<void> => {
  const events: WebhookEvent[] = req.body.events;

  events.map(async (event) => {
    try {
      await reply(client, event);
    } catch (err) {
      console.error(err);
    }
  });
});

app.listen(PORT, () => console.log(`Server is up on port ${PORT}`));
