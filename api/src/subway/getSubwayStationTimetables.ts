import { Station } from './data/stations';
import { timetables } from './data/timetables';
import { isWeekday } from '../common/utils'
import { SubwayStationTimetable } from './message/templates/subwayStationTimetableMessageTemplate'

/**
 * 対象の駅の時刻表を取得します。
 * @param station 駅オブジェクト。
 * @param isWeekday 平日かどうか。
 */
const getDiagrams = (station: Station, isWeekday: boolean) =>
  (isWeekday ?
      timetables.filter(t => t.id === station.id).shift()?.weekday_diagrams
    : timetables.filter(t => t.id === station.id).shift()?.holiday_diagrams);

/**
 * 
 * @param staion 時刻表を取得する対象の駅。
 * @param datetime 時刻表取得の基準となる日時。
 */
export const getSubwayStationTimetable = (station: Station, datetime: Date): SubwayStationTimetable | undefined => {
  // 現在日時を取得する
  let tempDt = datetime;
  let hour = tempDt.getHours();

  // 0時の時は24時間表記にするために1日前に戻す
  if (hour === 0) {
    tempDt.setDate(tempDt.getDate() - 1);
    hour = 24;
  }

  // 平日判定
  const todayIsWeekday = isWeekday(tempDt);

  // 時刻表取得
  const diagrams = getDiagrams(station, todayIsWeekday)
  if (!diagrams) { return; }

  return {
    id: station.id,
    name: station.offical_name,
    line_id: station.line_id,
    line_name: station.line_name,
    dateTime: tempDt,
    isWeekday: todayIsWeekday,
    timetables: diagrams.map(d => ({
      direction: d.direction,
      arrivals: d.arrivals.filter(a => a.time > hour * 100 + tempDt.getMinutes()).sort(a => a.time).slice(0, 3)
    }))
  }
};