import type { messagingApi, TextMessage } from '@line/bot-sdk';
import { createDiagramsMessage } from './diagramsMessage';
import { getLineById } from './lines';
import { specifyStationById, specifyStationsByName } from './stations';
import { getDiagrams } from './timetables';
import type { DiagramsMessageData } from './types';

/**
 * 駅が特定できなかった場合の返信メッセージを生成する
 * @returns 駅が特定できなかったことを示すテキストメッセージ
 */
function createStationNotFoundMessage(): messagingApi.TextMessage {
  return {
    type: 'text',
    text: '駅を特定できませんでした $',
    emojis: [
      {
        index: 13,
        productId: '5ac1bfd5040ab15980c9b435',
        emojiId: '024',
      },
    ],
  };
}

/**
 * テキストメッセージに対する返信メッセージを生成する
 * @param stationName - 駅名
 * @returns 時刻表メッセージ、または駅が見つからない場合はエラーメッセージ
 * @throws {Error} 線情報の取得に失敗した場合
 */
export function replyToTextMessage(stationName: string): messagingApi.FlexMessage | messagingApi.TextMessage {
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
}

/**
 * ポストバックメッセージに対する返信メッセージを生成する
 *
 * @param stationId - 駅ID
 * @param referenceDatetime - 基準日時
 * @returns 時刻表メッセージ、または駅が見つからない場合はエラーメッセージ
 * @throws {Error} 線情報の取得に失敗した場合
 */
export function replyToPostbackMessage(
  stationId: string,
  referenceDatetime: Date
): messagingApi.FlexMessage | messagingApi.TextMessage {
  // 駅特定
  const station = specifyStationById(stationId);
  if (!station) {
    return createStationNotFoundMessage();
  }

  // 路線
  const line = getLineById(station.lineId);
  if (!line) {
    throw new Error(`路線情報の取得に失敗しました。 lineId: ${station.lineId}`);
  }

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
}

export function replyToOtherMessage(): TextMessage {
  return {
    type: 'text',
    text: 'このメッセージ形式には対応していません',
  };
}
