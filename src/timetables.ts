import TIMETABLES from './constants/timetables';
import { toServiceDateTime } from './serviceDate';
import type { Diagram } from './types';
import { isWeekday } from './utils';

/**
 * 指定された駅の時刻表を取得する
 * @param stationId - 時刻表を取得する駅のID
 * @param referenceDatetime - 時刻表取得時に基準とする日時（JST の運行日で判定し、基準時刻ちょうどの発車も含む）
 * @returns 指定された駅の時刻表
 */
export function getDiagrams(stationId: string, referenceDatetime: Date): Diagram[] {
  const { serviceDate, time: borderTime } = toServiceDateTime(referenceDatetime);

  const timetable = TIMETABLES.find((t) => t.id === stationId);
  if (!timetable) {
    throw new Error('時刻表の取得に失敗しました。');
  }

  const diagrams = isWeekday(serviceDate) ? timetable.weekdayDiagrams : timetable.holidayDiagrams;

  return diagrams.map(({ direction, arrivals }) => ({
    direction,
    arrivals: arrivals.filter(({ time }) => time >= borderTime),
  }));
}
