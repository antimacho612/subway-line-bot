"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.specifyStationsByName = exports.specifyStationById = void 0;
const stations_1 = __importDefault(require("./constants/stations"));
const utils_1 = require("./utils");
/**
 * IDから時刻表を取得する駅を決定します。
 * @param id 駅のID。
 */
const specifyStationById = (id) => stations_1.default.find((station) => station.id === id);
exports.specifyStationById = specifyStationById;
/**
 * 指定された名前から時刻表を取得する駅を決定します。
 * @param name 判断対象となる名前（正式名称／一般名／略称など）
 */
const specifyStationsByName = (name) => {
    let buf = name.trim();
    buf = (0, utils_1.zenkakuNum2HankakuNum)(buf);
    buf = (0, utils_1.hankakuKana2Zenkakukana)(buf);
    buf = (0, utils_1.katakana2Hiragana)(buf);
    if (buf.endsWith('駅'))
        buf = buf.slice(0, -1);
    else if (buf.endsWith('えき'))
        buf = buf.slice(0, -2);
    return stations_1.default.filter((station) => station.commonNames.includes(buf));
};
exports.specifyStationsByName = specifyStationsByName;
