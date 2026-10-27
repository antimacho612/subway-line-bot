import { describe, expect, test } from 'vitest';
import { parsePostbackDatetime, toJstDatetimeString, toServiceDateTime } from '../src/serviceDate';
import { isWeekday } from '../src/utils';

/** JST の日時から Date を作る */
const jst = (str: string) => new Date(`${str}+09:00`);

describe('toServiceDateTime', () => {
  test.each([
    ['2024-06-10T00:00', 24, 0, 2400, [2024, 6, 9]],
    ['2024-06-10T00:59', 24, 59, 2459, [2024, 6, 9]],
    ['2024-06-10T01:00', 1, 0, 100, [2024, 6, 10]],
    ['2024-06-10T09:30', 9, 30, 930, [2024, 6, 10]],
    ['2024-06-10T23:59', 23, 59, 2359, [2024, 6, 10]],
    ['2024-03-01T00:15', 24, 15, 2415, [2024, 2, 29]], // 月またぎ・閏日
    ['2025-01-01T00:15', 24, 15, 2415, [2024, 12, 31]], // 年またぎ
  ] as const)('%s', (datetime, hour, minute, time, [y, m, d]) => {
    const result = toServiceDateTime(jst(datetime));
    expect(result.hour).toBe(hour);
    expect(result.minute).toBe(minute);
    expect(result.time).toBe(time);
    expect(result.serviceDate).toEqual({ year: y, month: m, day: d });
  });

  test('UTC の日付が JST と異なる時刻でも JST で解釈する', () => {
    // 2024-06-09T15:30Z = JST 6/10 0:30
    const result = toServiceDateTime(new Date('2024-06-09T15:30:00Z'));
    expect(result.time).toBe(2430);
    expect(result.serviceDate).toEqual({ year: 2024, month: 6, day: 9 });
  });

  test('祝日前日の0時台は祝日ではなく前日（平日）のダイヤになる', () => {
    // 2024-11-04(月・振替休日) 0:15 → 運行日 11/3(日・文化の日) 24:15
    expect(isWeekday(toServiceDateTime(jst('2024-11-04T00:15')).serviceDate)).toBe(false);
    // 2024-11-05(火) 0:15 → 運行日 11/4(月・振替休日)
    expect(isWeekday(toServiceDateTime(jst('2024-11-05T00:15')).serviceDate)).toBe(false);
    // 2024-11-06(水) 0:15 → 運行日 11/5(火)
    expect(isWeekday(toServiceDateTime(jst('2024-11-06T00:15')).serviceDate)).toBe(true);
    // 祝日前日(平日 2024-11-01 金) の 0 時台は 10/31(木・平日)
    expect(isWeekday(toServiceDateTime(jst('2024-11-01T00:15')).serviceDate)).toBe(true);
    // 祝日 2024-11-03(日) の前日 11/2(土) 24 時台 = 11/3 0:15 は土曜として休日扱い
    expect(isWeekday(toServiceDateTime(jst('2024-11-03T00:15')).serviceDate)).toBe(false);
  });
});

describe('parsePostbackDatetime', () => {
  test('タイムゾーンなしは JST として解釈する', () => {
    expect(parsePostbackDatetime('2024-06-10T09:30').toISOString()).toBe('2024-06-10T00:30:00.000Z');
  });

  test('秒付きでも JST として解釈する', () => {
    expect(parsePostbackDatetime('2024-06-10T09:30:15').toISOString()).toBe('2024-06-10T00:30:15.000Z');
  });

  test('タイムゾーン指定があればそれに従う', () => {
    expect(parsePostbackDatetime('2024-06-10T09:30:00Z').toISOString()).toBe('2024-06-10T09:30:00.000Z');
    expect(parsePostbackDatetime('2024-06-10T09:30:00+09:00').toISOString()).toBe('2024-06-10T00:30:00.000Z');
    expect(parsePostbackDatetime('2024-06-10T09:30+0900').toISOString()).toBe('2024-06-10T00:30:00.000Z');
  });

  test('日付だけの文字列の末尾をオフセットと誤検知しない', () => {
    expect(parsePostbackDatetime('2024-06-10').toISOString()).toBe('2024-06-09T15:00:00.000Z');
  });
});

describe('toJstDatetimeString', () => {
  test('JST の日時文字列に変換する', () => {
    expect(toJstDatetimeString(new Date('2024-06-09T15:30:00Z'))).toBe('2024-06-10T00:30');
    expect(toJstDatetimeString(jst('2024-12-31T23:59'))).toBe('2024-12-31T23:59');
  });
});
