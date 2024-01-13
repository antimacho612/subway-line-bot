import { FlexMessage, FlexBubble, FlexBox } from '@line/bot-sdk';
import { isWeekday } from './utils';
import { Diagram, DiagramsMessageData } from './types';

const format24DateTime = (date: Date): string => {
  const tempDatetime = new Date(date.getTime());
  let hour = date.getHours();
  // 0時の時は24時間表記にするために1日前に戻す
  if (hour === 0) {
    tempDatetime.setDate(tempDatetime.getDate() - 1);
    hour = 24;
  }

  const numToZeroPadStr = (num: number, len = 2, fillStr = ' ') => num.toString().padStart(len, fillStr);
  const MM = numToZeroPadStr(tempDatetime.getMonth() + 1);
  const DD = numToZeroPadStr(tempDatetime.getDate());
  const DAY = ['日', '月', '火', '水', '木', '金', '土'][tempDatetime.getDay()];
  const HH = numToZeroPadStr(hour);
  const mm = numToZeroPadStr(tempDatetime.getMinutes(), 2, '0');

  //M月D日（曜） H時mm分
  return `${MM}月${DD}日（${DAY}） ${HH}時${mm}分`;
};

const formatNumTime = (time: number) => {
  const str = (time < 2400 ? time : time - 2400).toString().padStart(4, '0');
  return `${parseInt(str.substring(0, 2))}時${str.substring(2, 4)}分`;
};

const getDiagramName = (date: Date): string => {
  const tempDatetime = new Date(date.getTime());
  const hour = tempDatetime.getHours();

  // 0時の時は24時間表記にするために1日前に戻す
  if (hour === 0) tempDatetime.setDate(tempDatetime.getDate() - 1);

  return isWeekday(tempDatetime) ? '平日ダイヤ' : '土日祝ダイヤ';
};

// ヘッダ
const createHeaderFlexBox = (data: DiagramsMessageData): FlexBox => ({
  type: 'box',
  layout: 'horizontal',
  contents: [
    {
      type: 'box',
      layout: 'horizontal',
      contents: [
        {
          type: 'box',
          layout: 'horizontal',
          contents: [],
          backgroundColor: '#FFFFFF',
          cornerRadius: '24px',
          borderColor: data.line.themeColor,
          borderWidth: 'medium',
          width: '24px',
          paddingAll: '14px',
          height: '24px',
          offsetStart: '2px',
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: data.station.id,
              color: data.line.themeColor,
              weight: 'bold',
              size: '14px',
              align: 'center',
              gravity: 'center',
            },
          ],
          width: '36px',
          height: '36px',
          borderWidth: 'medium',
          borderColor: '#FFFFFF',
          cornerRadius: '24px',
          offsetStart: '-32px',
        },
      ],
      alignItems: 'center',
      flex: 1,
      offsetTop: '6px',
    },
    {
      type: 'text',
      text: data.station.officialName,
      weight: 'bold',
      color: '#FFFFFF',
      size: 'xl',
      flex: 4,
    },
    {
      type: 'text',
      text: data.line.name,
      position: 'absolute',
      color: '#FFFFFF',
      weight: 'regular',
      offsetTop: '2px',
      offsetStart: '16px',
      size: '10px',
    },
  ],
  backgroundColor: data.line.themeColor,
  height: '56px',
  alignItems: 'center',
});

// メイン
const createMainContent = (diagram: Diagram): FlexBox => ({
  type: 'box',
  layout: 'vertical',
  contents: [
    {
      type: 'box',
      layout: 'baseline',
      spacing: 'sm',
      contents: [
        {
          type: 'text',
          text: `●${diagram.direction}`,
          size: 'sm',
        },
      ],
    },
    {
      type: 'box',
      layout: 'baseline',
      contents: [
        {
          type: 'text',
          text:
            diagram.arrivals.length === 0
              ? '本日の運行は終了しています'
              : diagram.arrivals
                  .slice(0, 3) // 直近3件のみ表示
                  .map((arrival) => formatNumTime(arrival.time) + (arrival.note ? `（※${arrival.note}）` : ''))
                  .join('\n'),
          color: '#666666',
          size: 'sm',
          margin: 'xl',
          wrap: true,
        },
      ],
    },
  ],
});

// ボディ
const createBodyFlexBox = (data: DiagramsMessageData): FlexBox => ({
  type: 'box',
  layout: 'vertical',
  contents: [
    {
      type: 'text',
      text: format24DateTime(data.referenceDatetime),
      weight: 'bold',
    },
    {
      type: 'box',
      layout: 'baseline',
      contents: [
        {
          type: 'text',
          text: getDiagramName(data.referenceDatetime),
          size: 'sm',
          color: '#999999',
          margin: 'md',
          align: 'end',
        },
      ],
      margin: 'xs',
    },
    {
      type: 'box',
      layout: 'vertical',
      contents: data.diagrams.map((diagram) => createMainContent(diagram)),
      spacing: 'sm',
    },
  ],
});

// フッタ
const createFooterFlexBox = (data: DiagramsMessageData): FlexBox => ({
  type: 'box',
  layout: 'vertical',
  contents: [
    {
      type: 'button',
      style: 'primary',
      action: {
        type: 'datetimepicker',
        label: '出発日時を指定する',
        data: data.station.id,
        mode: 'datetime',
      },
      height: 'sm',
      color: '#0286B2',
    },
  ],
});

// バブルコンテンツ
const createFlexBubbleContent = (data: DiagramsMessageData): FlexBubble => ({
  type: 'bubble',
  size: 'kilo',
  header: createHeaderFlexBox(data),
  body: createBodyFlexBox(data),
  footer: createFooterFlexBox(data),
  styles: {
    footer: {
      separator: true,
    },
  },
});

export const createDiagramsMessage = (messageDataList: DiagramsMessageData[]): FlexMessage => ({
  type: 'flex',
  altText:
    messageDataList.length === 1 ? `${messageDataList[0].station.officialName}からの地下鉄発車時刻を送信しました` : '地下鉄発車時刻を送信しました',
  contents: {
    type: 'carousel',
    contents: messageDataList.map((data) => createFlexBubbleContent(data)),
  },
});
