"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyToTextMessage = replyToTextMessage;
exports.replyToPostbackMessage = replyToPostbackMessage;
exports.replyToOtherMessage = replyToOtherMessage;
const diagramsMessage_1 = require("./diagramsMessage");
const lines_1 = require("./lines");
const stations_1 = require("./stations");
const timetables_1 = require("./timetables");
/**
 * 駅が特定できなかった場合の返信メッセージを生成する
 * @returns 駅が特定できなかったことを示すテキストメッセージ
 */
function createStationNotFoundMessage() {
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
function replyToTextMessage(stationName) {
    // 基準となる日時 = 現在日付
    const referenceDatetime = new Date(Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000);
    // 駅特定
    const stations = (0, stations_1.specifyStationsByName)(stationName);
    if (!stations.length)
        return createStationNotFoundMessage();
    // 駅ごとに線の情報と時刻表を取得
    const messageDataList = stations.map((station) => {
        // 線
        const line = (0, lines_1.getLineById)(station.lineId);
        if (!line)
            throw new Error(`線情報の取得に失敗しました。 lineId: ${station.lineId}`);
        // ダイヤ
        const diagrams = (0, timetables_1.getDiagrams)(station.id, referenceDatetime);
        return { station, line, referenceDatetime, diagrams };
    });
    return (0, diagramsMessage_1.createDiagramsMessage)(messageDataList);
}
/**
 * ポストバックメッセージに対する返信メッセージを生成する
 *
 * @param stationId - 駅ID
 * @param referenceDatetime - 基準日時
 * @returns 時刻表メッセージ、または駅が見つからない場合はエラーメッセージ
 * @throws {Error} 線情報の取得に失敗した場合
 */
function replyToPostbackMessage(stationId, referenceDatetime) {
    // 駅特定
    const station = (0, stations_1.specifyStationById)(stationId);
    if (!station) {
        return createStationNotFoundMessage();
    }
    // 路線
    const line = (0, lines_1.getLineById)(station.lineId);
    if (!line) {
        throw new Error(`路線情報の取得に失敗しました。 lineId: ${station.lineId}`);
    }
    // ダイヤ
    const diagrams = (0, timetables_1.getDiagrams)(station.id, referenceDatetime);
    // 線の情報と時刻表を取得
    const stationDiagrams = {
        station,
        line,
        referenceDatetime,
        diagrams,
    };
    return (0, diagramsMessage_1.createDiagramsMessage)([stationDiagrams]);
}
function replyToOtherMessage() {
    return {
        type: 'text',
        text: 'このメッセージ形式には対応していません',
    };
}
