import { afterEach, describe, expect, test, vi } from 'vitest';
import * as timetables from '../src/timetables';
import * as utils from '../src/utils';

vi.mock('../src/constants/timetables', () => ({
  __esModule: true,
  default: [
    {
      id: 'stationA',
      weekdayDiagrams: [
        {
          direction: 'up',
          arrivals: [{ time: 600 }, { time: 900 }, { time: 1300 }, { time: 2400 }, { time: 2416 }],
        },
        {
          direction: 'down',
          arrivals: [{ time: 700 }, { time: 1000 }, { time: 1500 }],
        },
      ],
      holidayDiagrams: [
        {
          direction: 'up',
          arrivals: [{ time: 800 }, { time: 1200 }, { time: 1800 }],
        },
      ],
    },
  ],
}));

describe('getDiagrams', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('平日ダイヤのフィルタ・ソート結果が正しい', () => {
    vi.spyOn(utils, 'isWeekday').mockReturnValue(true);

    const date = new Date('2024-06-10T09:30:00+09:00'); // 9:30
    const result = timetables.getDiagrams('stationA', date);

    expect(result).toEqual([
      {
        direction: 'up',
        arrivals: [{ time: 1300 }, { time: 2400 }, { time: 2416 }],
      },
      {
        direction: 'down',
        arrivals: [{ time: 1000 }, { time: 1500 }],
      },
    ]);
  });

  test('休日ダイヤのフィルタ結果が正しい', () => {
    vi.spyOn(utils, 'isWeekday').mockReturnValue(false);

    const date = new Date('2024-06-09T11:00:00+09:00'); // 11:00
    const result = timetables.getDiagrams('stationA', date);

    expect(result).toEqual([
      {
        direction: 'up',
        arrivals: [{ time: 1200 }, { time: 1800 }],
      },
    ]);
  });

  test('0時台は前日24時扱いになる', () => {
    vi.spyOn(utils, 'isWeekday').mockReturnValue(true);

    const date = new Date('2024-06-10T00:15:00+09:00'); // 0:15
    const result = timetables.getDiagrams('stationA', date);

    expect(result).toEqual([
      {
        direction: 'up',
        arrivals: [{ time: 2416 }],
      },
      {
        direction: 'down',
        arrivals: [],
      },
    ]);
  });

  test('基準時刻ちょうどに発車する列車を含む', () => {
    vi.spyOn(utils, 'isWeekday').mockReturnValue(true);

    const result = timetables.getDiagrams('stationA', new Date('2024-06-10T09:00:00+09:00'));

    expect(result[0].arrivals).toEqual([{ time: 900 }, { time: 1300 }, { time: 2400 }, { time: 2416 }]);
  });

  test('0:00ちょうどは前日24:00発の列車を含む', () => {
    vi.spyOn(utils, 'isWeekday').mockReturnValue(true);

    const result = timetables.getDiagrams('stationA', new Date('2024-06-10T00:00:00+09:00'));

    expect(result[0].arrivals).toEqual([{ time: 2400 }, { time: 2416 }]);
  });

  test('1:00には24時台の列車も全て残る（運行日が切り替わる）', () => {
    vi.spyOn(utils, 'isWeekday').mockReturnValue(true);

    const result = timetables.getDiagrams('stationA', new Date('2024-06-10T01:00:00+09:00'));

    expect(result[0].arrivals).toEqual([{ time: 600 }, { time: 900 }, { time: 1300 }, { time: 2400 }, { time: 2416 }]);
  });

  test('0時台は前日の運行日で平日/休日ダイヤを選ぶ', () => {
    // 2024-06-10(月) 0:15 → 運行日 6/9(日) → 休日ダイヤ（方面 1 つ）
    expect(timetables.getDiagrams('stationA', new Date('2024-06-10T00:15:00+09:00'))).toHaveLength(1);
    // 2024-06-11(火) 0:15 → 運行日 6/10(月) → 平日ダイヤ（方面 2 つ）
    expect(timetables.getDiagrams('stationA', new Date('2024-06-11T00:15:00+09:00'))).toHaveLength(2);
  });

  test('存在しないstationIdの場合はエラー', () => {
    vi.spyOn(utils, 'isWeekday').mockReturnValue(true);

    const date = new Date('2024-06-10T09:30:00+09:00');
    expect(() => timetables.getDiagrams('stationX', date)).toThrow('時刻表の取得に失敗しました。');
  });
});
