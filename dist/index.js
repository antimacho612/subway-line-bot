"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_sdk_1 = require("@line/bot-sdk");
const express_1 = __importDefault(require("express"));
const reply_1 = require("./reply");
require("dotenv/config");
const PORT = process.env.PORT || 3000;
const clientConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};
const middlewareConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};
const client = new bot_sdk_1.messagingApi.MessagingApiClient(clientConfig);
const app = (0, express_1.default)();
const reply = async (event) => {
    if (event.type !== 'message' && event.type !== 'postback')
        return;
    let message;
    if (event.type === 'message' && event.message.type === 'text') {
        message = (0, reply_1.replyToTextMessage)(event.message.text);
    }
    else if (event.type === 'postback' && event.postback.params && 'datetime' in event.postback.params && event.postback.params.datetime) {
        message = (0, reply_1.replyToPostbackMessage)(event.postback.data, new Date(event.postback.params.datetime));
    }
    else {
        message = (0, reply_1.replyToOtherMessage)();
    }
    await client.replyMessage({
        replyToken: event.replyToken,
        messages: [message],
    });
};
// Testing Routing
app.get('/', async (_, res) => {
    return res.status(200).json({
        status: 'success',
        message: 'Connected successfully!',
    });
});
// API Routing
app.post('/webhook', (0, bot_sdk_1.middleware)(middlewareConfig), async (req, res) => {
    const events = req.body.events;
    const results = await Promise.all(events.map(async (event) => {
        try {
            await reply(event);
        }
        catch (e) {
            if (e instanceof Error) {
                console.error(e);
            }
            return res.status(500).json({ status: 'error' });
        }
    }));
    return res.status(200).json({
        status: 'success',
        results,
    });
});
app.listen(PORT, () => {
    console.log(`Application is live and listening on port ${PORT}`);
});
