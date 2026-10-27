"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiagrams = getDiagrams;
const timetables_1 = __importDefault(require("./constants/timetables"));
const utils_1 = require("./utils");
/**
 * 指定された駅の時刻表を取得する
 * @param stationId - 時刻表を取得する駅のID
 * @param referenceDatetime - 時刻表取得時に基準とする日時
 * @returns 指定された駅の時刻表
 */
function getDiagrams(stationId, referenceDatetime) {
    const tempDatetime = new Date(referenceDatetime);
    let hour = tempDatetime.getHours();
    // 0時の場合は前日に戻し、24時として扱う
    if (hour === 0) {
        tempDatetime.setDate(tempDatetime.getDate() - 1);
        hour = 24;
    }
    const borderTime = hour * 100 + tempDatetime.getMinutes();
    const timetable = timetables_1.default.find((t) => t.id === stationId);
    if (!timetable) {
        throw new Error('時刻表の取得に失敗しました。');
    }
    const diagrams = (0, utils_1.isWeekday)(tempDatetime) ? timetable.weekdayDiagrams : timetable.holidayDiagrams;
    return diagrams.map(({ direction, arrivals }) => ({
        direction,
        arrivals: arrivals.filter(({ time }) => time > borderTime).sort((a, b) => a.time - b.time),
    }));
}
