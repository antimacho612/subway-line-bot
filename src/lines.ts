import LINES from './constants/lines';
import type { Line, LineId } from './types';

/**
 * 駅のIDから路線情報を取得する
 * @param id - 駅のID
 * @returns 路線情報、存在しない場合はundefined
 */
export function getLineById(id: LineId): Readonly<Line> | undefined {
  return LINES.find((line) => line.id === id);
}
