import type { messagingApi } from '@line/bot-sdk';
import { describe, expect, test } from 'vitest';
import { createDiagramsMessage } from '../src/diagramsMessage';
import type { Arrival, DiagramsMessageData } from '../src/types';

const jst = (str: string) => new Date(`${str}+09:00`);

function makeData(datetime: string, arrivals: Arrival[], stationName = 'さっぽろ'): DiagramsMessageData {
  return {
    station: { id: 'N06', lineId: 'N', officialName: stationName, commonNames: [], url: 'https://example.com' },
    line: { id: 'N', name: '南北線', themeColor: '#00AA00' },
    referenceDatetime: jst(datetime),
    diagrams: [{ direction: '真駒内方面', arrivals }],
  };
}

function build(datetime: string, times: number[], notes: Record<number, string> = {}) {
  const data = makeData(
    datetime,
    times.map((time) => ({ time, note: notes[time] }))
  );
  const message = createDiagramsMessage([data]);
  const bubble = (message.contents as messagingApi.FlexCarousel).contents[0];
  const body = bubble.body as messagingApi.FlexBox;
  const [headerText, nameBox, diagramBox] = body.contents as [
    messagingApi.FlexText,
    messagingApi.FlexBox,
    messagingApi.FlexBox,
  ];
  const mainContent = (diagramBox.contents[0] as messagingApi.FlexBox).contents[1] as messagingApi.FlexBox;
  return {
    header: headerText.text ?? '',
    diagramName: (nameBox.contents[0] as messagingApi.FlexText).text ?? '',
    times: (mainContent.contents[0] as messagingApi.FlexText).text ?? '',
  };
}

describe('createDiagramsMessage', () => {
  test('0時台は前日の24時台として表示される', () => {
    const result = build('2024-06-10T00:15', [2416, 2430]);
    expect(result.header).toBe(' 6月 9日（日） 24時15分');
    expect(result.diagramName).toBe('土日祝ダイヤ');
    expect(result.times).toBe('24時16分\n24時30分');
  });

  test('0:00 / 0:59 / 1:00 の境界', () => {
    expect(build('2024-06-10T00:00', []).header).toBe(' 6月 9日（日） 24時00分');
    expect(build('2024-06-10T00:59', []).header).toBe(' 6月 9日（日） 24時59分');
    expect(build('2024-06-10T01:00', []).header).toBe(' 6月10日（月）  1時00分');
    expect(build('2024-06-10T23:59', []).header).toBe(' 6月10日（月） 23時59分');
  });

  test('祝日前日の0時台は運行日の前日（祝日の前日）のダイヤ名になる', () => {
    // 2024-11-04(月・振替休日) 0:15 → 運行日 11/3(日・祝日)
    expect(build('2024-11-04T00:15', []).diagramName).toBe('土日祝ダイヤ');
    // 2024-11-05(火) 0:15 → 運行日 11/4(月・振替休日)
    expect(build('2024-11-05T00:15', []).diagramName).toBe('土日祝ダイヤ');
    // 2024-11-06(水) 0:15 → 運行日 11/5(火・平日)
    expect(build('2024-11-06T00:15', []).diagramName).toBe('平日ダイヤ');
  });

  test('発車時刻一覧は通常の時刻を「H時mm分」で表示する', () => {
    expect(build('2024-06-10T05:00', [600, 2359]).times).toBe('6時00分\n23時59分');
  });

  test('運行終了時は終了メッセージを表示する', () => {
    expect(build('2024-06-10T01:30', []).times).toBe('本日の運行は終了しています');
  });

  test('発車時刻は直近3件のみ表示する', () => {
    expect(build('2024-06-10T05:00', [600, 610, 620, 630]).times).toBe('6時00分\n6時10分\n6時20分');
  });

  test('noteがある場合は時刻の後ろに（※note）を付ける', () => {
    expect(build('2024-06-10T05:00', [600, 610], { 600: '始発' }).times).toBe('6時00分（※始発）\n6時10分');
  });

  describe('altText', () => {
    test('1駅の場合は駅名を含む', () => {
      const message = createDiagramsMessage([makeData('2024-06-10T09:00', [{ time: 930 }])]);
      expect(message.altText).toBe('さっぽろからの地下鉄発車時刻を送信しました');
    });

    test('複数駅の場合は駅名を含まない', () => {
      const message = createDiagramsMessage([
        makeData('2024-06-10T09:00', [{ time: 930 }]),
        makeData('2024-06-10T09:00', [{ time: 930 }], '大通'),
      ]);
      expect(message.altText).toBe('地下鉄発車時刻を送信しました');
      expect((message.contents as messagingApi.FlexCarousel).contents).toHaveLength(2);
    });
  });
});
