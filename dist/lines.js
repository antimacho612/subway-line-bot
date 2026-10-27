"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineById = getLineById;
const lines_1 = __importDefault(require("./constants/lines"));
/**
 * 駅のIDから路線情報を取得する
 * @param id - 駅のID
 * @returns 路線情報、存在しない場合はundefined
 */
function getLineById(id) {
    return lines_1.default.find((line) => line.id === id);
}
