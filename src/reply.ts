import type { messagingApi } from '@line/bot-sdk';
import { createDiagramsMessage } from './diagramsMessage';
import { getLineById } from './lines';
import { specifyStationById, specifyStationsByName } from './stations';
import { getDiagrams } from './timetables';
import type { DiagramsMessageData, Station } from './types';

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
 * 駅の路線情報と時刻表をまとめたメッセージデータを生成する
 * @param station - 駅
 * @param referenceDatetime - 基準日時
 * @returns メッセージデータ
 * @throws {Error} 路線情報の取得に失敗した場合
 */
function buildMessageData(station: Station, referenceDatetime: Date): DiagramsMessageData {
  const line = getLineById(station.lineId);
  if (!line) throw new Error(`路線情報の取得に失敗しました。 lineId: ${station.lineId}`);

  const diagrams = getDiagrams(station.id, referenceDatetime);

  return { station, line, referenceDatetime, diagrams };
}

/**
 * テキストメッセージに対する返信メッセージを生成する
 * @param stationName - 駅名
 * @returns 時刻表メッセージ、または駅が見つからない場合はエラーメッセージ
 * @throws {Error} 路線情報の取得に失敗した場合
 */
export function replyToTextMessage(stationName: string): messagingApi.FlexMessage | messagingApi.TextMessage {
  // 基準となる日時 = 現在時刻（JST への変換は toServiceDateTime が行う）
  const referenceDatetime = new Date();

  const stations = specifyStationsByName(stationName);
  if (!stations.length) return createStationNotFoundMessage();

  return createDiagramsMessage(stations.map((station) => buildMessageData(station, referenceDatetime)));
}

/**
 * ポストバックメッセージに対する返信メッセージを生成する
 *
 * @param stationId - 駅ID
 * @param referenceDatetime - 基準日時
 * @returns 時刻表メッセージ、または駅が見つからない場合はエラーメッセージ
 * @throws {Error} 路線情報の取得に失敗した場合
 */
export function replyToPostbackMessage(
  stationId: string,
  referenceDatetime: Date
): messagingApi.FlexMessage | messagingApi.TextMessage {
  const station = specifyStationById(stationId);
  if (!station) return createStationNotFoundMessage();

  return createDiagramsMessage([buildMessageData(station, referenceDatetime)]);
}

/**
 * テキスト・ポストバック以外のメッセージに対する返信メッセージを生成する
 * @returns 非対応であることを示すテキストメッセージ
 */
export function replyToOtherMessage(): messagingApi.TextMessage {
  return {
    type: 'text',
    text: 'このメッセージ形式には対応していません',
  };
}

/**
 * 返信メッセージの生成に失敗した場合のフォールバックメッセージを生成する
 * @returns 時刻表の取得に失敗したことを示すテキストメッセージ
 */
export function replyToFailure(): messagingApi.TextMessage {
  return {
    type: 'text',
    text: '時刻表の取得に失敗しました',
  };
}
