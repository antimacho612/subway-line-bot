import { TextMessage } from "@line/bot-sdk";

export const notSupportedMessageTypeErrorMessage: TextMessage = {
  type: "text",
  text: "このメッセージ形式には対応していません",
};

export const stationNotFoundErrorMessage: TextMessage = {
  type: "text",
  text: "駅を特定できませんでした $",
  emojis: [
    {
      index: 13,
      productId: "5ac1bfd5040ab15980c9b435",
      emojiId: "024",
    },
  ],
};
