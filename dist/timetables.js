"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiagrams = void 0;
const timetables_1 = __importDefault(require("./constants/timetables"));
const utils_1 = require("./utils");
/**
 * 指定された駅の時刻表を取得する
 * @param stationId 時刻表を取得する駅のID
 * @param referenceDatetime 時刻表取得時に基準とする日時
 */
const getDiagrams = (stationId, referenceDatetime) => {
    const tempDatetime = new Date(referenceDatetime.getTime());
    let hour = tempDatetime.getHours();
    // 0時の時は24時間表記にするために1日前に戻す
    if (hour === 0) {
        tempDatetime.setDate(tempDatetime.getDate() - 1);
        hour = 24;
    }
    const borderTime = hour * 100 + tempDatetime.getMinutes();
    // 平日判定
    const todayIsWeekday = (0, utils_1.isWeekday)(tempDatetime);
    // 時刻表取得
    const diagrams = todayIsWeekday
        ? timetables_1.default.find((timetable) => timetable.id === stationId)?.weekdayDiagrams
        : timetables_1.default.find((timetable) => timetable.id === stationId)?.holidayDiagrams;
    if (!diagrams)
        throw new Error('時刻表の取得に失敗しました。');
    return diagrams.map((d) => ({
        direction: d.direction,
        arrivals: d.arrivals.filter((arrival) => arrival.time > borderTime).sort((arrivalA, arrivalB) => arrivalA.time - arrivalB.time),
    }));
};
exports.getDiagrams = getDiagrams;
