"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyToOtherMessage = exports.replyToPostbackMessage = exports.replyToTextMessage = void 0;
const diagramsMessage_1 = require("./diagramsMessage");
const stations_1 = require("./stations");
const timetables_1 = require("./timetables");
const lines_1 = require("./lines");
const createStationNotFoundMessage = () => ({
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
const replyToTextMessage = (stationName) => {
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
};
exports.replyToTextMessage = replyToTextMessage;
const replyToPostbackMessage = (stationId, referenceDatetime) => {
    // 駅特定
    const station = (0, stations_1.specifyStationById)(stationId);
    if (!station)
        return createStationNotFoundMessage();
    // 線
    const line = (0, lines_1.getLineById)(station.lineId);
    if (!line)
        throw new Error(`線情報の取得に失敗しました。 lineId: ${station.lineId}`);
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
};
exports.replyToPostbackMessage = replyToPostbackMessage;
const replyToOtherMessage = () => ({
    type: 'text',
    text: 'このメッセージ形式には対応していません',
});
exports.replyToOtherMessage = replyToOtherMessage;
