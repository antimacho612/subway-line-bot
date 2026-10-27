"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specifyStationById = specifyStationById;
exports.specifyStationsByName = specifyStationsByName;
const stations_1 = __importDefault(require("./constants/stations"));
const utils_1 = require("./utils");
/**
 * IDから時刻表を取得する駅を決定する
 * @param id - 駅のID
 * @returns 駅情報、該当なしの場合はundefined
 */
function specifyStationById(id) {
    return stations_1.default.find((station) => station.id === id);
}
/**
 * 指定された名前から時刻表を取得する駅を決定する
 * @param name - 判断対象となる名前（正式名称／一般名／略称など）
 * @returns 駅情報の配列、一致しない場合は空配列
 */
function specifyStationsByName(name) {
    let buf = (0, utils_1.katakana2Hiragana)((0, utils_1.hankakuKana2Zenkakukana)((0, utils_1.zenkakuNum2HankakuNum)(name.trim())));
    buf = buf.replace(/(駅|えき)$/, '');
    return stations_1.default.filter((station) => station.commonNames.includes(buf));
}
