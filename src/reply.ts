import { TextMessage } from '@line/bot-sdk';
import { createDiagramsMessage } from './diagramsMessage';
import { specifyStationById, specifyStationsByName } from './stations';
import { getDiagrams } from './timetables';
import { getLineById } from './lines';
import { DiagramsMessageData } from './types';

const createStationNotFoundMessage = (): TextMessage => ({
  type: 'text',
  text: '駅を特定できませんでした $',
  emojis: [
    {
      index: 13,
      productId: '5ac1bfd5040ab15980c9b435',
      emojiId: '024',
    },
  ],
});

export const replyToTextMessage = (stationName: string) => {
  // 基準となる日時 = 現在日付
  const referenceDatetime = new Date(Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000);

  // 駅特定
  const stations = specifyStationsByName(stationName);
  if (!stations.length) return createStationNotFoundMessage();

  // 駅ごとに線の情報と時刻表を取得
  const messageDataList: DiagramsMessageData[] = stations.map((station) => {
    // 線
    const line = getLineById(station.lineId);
    if (!line) throw new Error(`線情報の取得に失敗しました。 lineId: ${station.lineId}`);

    // ダイヤ
    const diagrams = getDiagrams(station.id, referenceDatetime);

    return { station, line, referenceDatetime, diagrams };
  });

  return createDiagramsMessage(messageDataList);
};

export const replyToPostbackMessage = (stationId: string, referenceDatetime: Date) => {
  // 駅特定
  const station = specifyStationById(stationId);
  if (!station) return createStationNotFoundMessage();

  // 線
  const line = getLineById(station.lineId);
  if (!line) throw new Error(`線情報の取得に失敗しました。 lineId: ${station.lineId}`);

  // ダイヤ
  const diagrams = getDiagrams(station.id, referenceDatetime);

  // 線の情報と時刻表を取得
  const stationDiagrams: DiagramsMessageData = {
    station,
    line,
    referenceDatetime,
    diagrams,
  };

  return createDiagramsMessage([stationDiagrams]);
};

export const replyToOtherMessage = (): TextMessage => ({
  type: 'text',
  text: 'このメッセージ形式には対応していません',
});
