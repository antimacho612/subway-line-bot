import { FlexMessage, FlexBubble, FlexBox } from "@line/bot-sdk";
import { isWeekday } from "../utils";
import { Line } from "../data/lines";
import { Station } from "../data/stations";
import { Diagram } from "../data/timetables";

export type SubwayStationDiagrams = {
  station: Station;
  line: Line;
  referenceDatetime: Date;
  diagrams: Diagram[];
};

const format24DateTime = (date: Date): string => {
  let tempDatetime = new Date(date.getTime());
  let hour = date.getHours();

  // 0時の時は24時間表記にするために1日前に戻す
  if (hour === 0) {
    tempDatetime.setDate(tempDatetime.getDate() - 1);
    hour = 24;
  }

  //MM月DD日（曜） HH時mm分
  return `${(tempDatetime.getMonth() + 1).toString().padStart(2)}月${tempDatetime.getDate().toString().padStart(2)}日（${
    ["日", "月", "火", "水", "木", "金", "土"][tempDatetime.getDay()]
  }） ${hour.toString().padStart(2)}時${tempDatetime.getMinutes().toString().padStart(2, "0")}分`;
};

const formatNumTime = (time: number) => {
  const str = (time < 2400 ? time : time - 2400).toString().padStart(4, "0");
  return `${parseInt(str.substring(0, 2))}時${str.substring(2, 4)}分`;
};

const getDiagramName = (date: Date): string => {
  let tempDatetime = new Date(date.getTime());
  let hour = tempDatetime.getHours();

  // 0時の時は24時間表記にするために1日前に戻す
  if (hour === 0) {
    tempDatetime.setDate(tempDatetime.getDate() - 1);
  }

  return isWeekday(tempDatetime) ? "平日ダイヤ" : "土日祝ダイヤ";
};

// ヘッダ
const bubbleHeaderTemplate = (data: SubwayStationDiagrams): FlexBox => ({
  type: "box",
  layout: "horizontal",
  contents: [
    {
      type: "box",
      layout: "horizontal",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [],
          backgroundColor: "#FFFFFF",
          cornerRadius: "24px",
          borderColor: data.line.themeColor,
          borderWidth: "medium",
          width: "24px",
          paddingAll: "14px",
          height: "24px",
          offsetStart: "2px",
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: data.station.id,
              color: data.line.themeColor,
              weight: "bold",
              size: "14px",
              align: "center",
              gravity: "center",
            },
          ],
          width: "36px",
          height: "36px",
          borderWidth: "medium",
          borderColor: "#FFFFFF",
          cornerRadius: "24px",
          offsetStart: "-32px",
        },
      ],
      alignItems: "center",
      flex: 1,
      offsetTop: "6px",
    },
    {
      type: "text",
      text: data.station.officialName,
      weight: "bold",
      color: "#FFFFFF",
      size: "xl",
      flex: 4,
    },
    {
      type: "text",
      text: data.line.name,
      position: "absolute",
      color: "#FFFFFF",
      weight: "regular",
      offsetTop: "2px",
      offsetStart: "16px",
      size: "10px",
    },
  ],
  backgroundColor: data.line.themeColor,
  height: "56px",
  alignItems: "center",
});

// メイン
const mainContentTemplate = (diagram: Diagram): FlexBox => ({
  type: "box",
  layout: "vertical",
  contents: [
    {
      type: "box",
      layout: "baseline",
      spacing: "sm",
      contents: [
        {
          type: "text",
          text: "●" + diagram.direction,
          size: "sm",
        },
      ],
    },
    {
      type: "box",
      layout: "baseline",
      contents: [
        {
          type: "text",
          text:
            diagram.arrivals.length === 0
              ? "運行は終了しています"
              : diagram.arrivals
                  .slice(0, 3) // 直近3件のみ表示
                  .map((a) => formatNumTime(a.time) + (a.note ? `（※${a.note}）` : ""))
                  .join("\n"),
          color: "#666666",
          size: "sm",
          margin: "xl",
          wrap: true,
        },
      ],
    },
  ],
});

// ボディ
const bubbleBodyTemplate = (data: SubwayStationDiagrams): FlexBox => ({
  type: "box",
  layout: "vertical",
  contents: [
    {
      type: "text",
      text: format24DateTime(data.referenceDatetime),
      weight: "bold",
    },
    {
      type: "box",
      layout: "baseline",
      contents: [
        {
          type: "text",
          text: getDiagramName(data.referenceDatetime),
          size: "sm",
          color: "#999999",
          margin: "md",
          align: "end",
        },
      ],
      margin: "xs",
    },
    {
      type: "box",
      layout: "vertical",
      contents: data.diagrams.map((diagram) => mainContentTemplate(diagram)),
      spacing: "sm",
    },
  ],
});

// フッタ
const bubbleFooterTemplate = (data: SubwayStationDiagrams): FlexBox => ({
  type: "box",
  layout: "vertical",
  contents: [
    {
      type: "button",
      style: "primary",
      action: {
        type: "datetimepicker",
        label: "出発日時を指定する",
        data: data.station.id,
        mode: "datetime",
      },
      height: "sm",
      color: "#0286B2",
    },
  ],
});

// テンプレート
const bubbleTemplate = (data: SubwayStationDiagrams): FlexBubble => ({
  type: "bubble",
  size: "kilo",
  header: bubbleHeaderTemplate(data),
  body: bubbleBodyTemplate(data),
  footer: bubbleFooterTemplate(data),
  styles: {
    footer: {
      separator: true,
    },
  },
});

export const subwayStationDiagramsMessageTemplate = (datas: SubwayStationDiagrams[]): FlexMessage => ({
  type: "flex",
  altText: datas.length === 1 ? `${datas[0].station.officialName}からの地下鉄発車時刻を送信しました` : "地下鉄発車時刻を送信しました",
  contents: {
    type: "carousel",
    contents: datas.map((data) => bubbleTemplate(data)),
  },
});
