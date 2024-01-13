import LINES from './constants/lines';
import { LineId } from './types';

/**
 * 駅のIDから線の情報を取得する
 * @param id 駅のID
 */
export const getLineById = (id: LineId) => LINES.find((line) => line.id === id);
