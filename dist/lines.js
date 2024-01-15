"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLineById = void 0;
const lines_1 = __importDefault(require("./constants/lines"));
/**
 * 駅のIDから線の情報を取得する
 * @param id 駅のID
 */
const getLineById = (id) => lines_1.default.find((line) => line.id === id);
exports.getLineById = getLineById;
