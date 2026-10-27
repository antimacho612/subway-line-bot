import type { PlainDate } from './types';

const JST_OFFSET_MS = 9 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

/** 時刻部分（T 以降）がタイムゾーン指定（Z / ±hh:mm / ±hhmm）で終わっているか */
const HAS_TIMEZONE = /T.*(?:[zZ]|[+-]\d{2}(?::?\d{2})?)$/;

/** 運行日基準の日時（JST） */
export type ServiceDateTime = {
  /** 運行日（JST の年月日。曜日・祝日判定用） */
  serviceDate: PlainDate;
  /** 時（0〜24。0 時台は前日の 24 時として扱う） */
  hour: number;
  /** 分 */
  minute: number;
  /** 時刻表の time と比較できる数値（例: 24 時 15 分 → 2415） */
  time: number;
};

/**
 * 日時を JST の運行日基準に変換する。サーバーのタイムゾーンには依存しない。
 * 0 時台は前日の 24 時台として扱う（例: 6/11 0:15 → 運行日 6/10 の 24 時 15 分）
 * @param date - 日時
 * @returns 運行日基準の日時
 */
export function toServiceDateTime(date: Date): ServiceDateTime {
  const jst = new Date(date.getTime() + JST_OFFSET_MS);
  const isPastMidnight = jst.getUTCHours() === 0;
  // 0 時台は前日に戻す
  const base = isPastMidnight ? new Date(jst.getTime() - DAY_MS) : jst;

  const hour = isPastMidnight ? 24 : jst.getUTCHours();
  const minute = jst.getUTCMinutes();

  return {
    serviceDate: { year: base.getUTCFullYear(), month: base.getUTCMonth() + 1, day: base.getUTCDate() },
    hour,
    minute,
    time: hour * 100 + minute,
  };
}

/**
 * 日時を datetimepicker で使う JST の文字列に変換する
 * @param date - 日時
 * @returns JST の日時文字列（例: "2024-06-10T09:30"）
 */
export function toJstDatetimeString(date: Date): string {
  return new Date(date.getTime() + JST_OFFSET_MS).toISOString().slice(0, 16);
}

/**
 * ポストバックの日時文字列を解析する。タイムゾーンの指定がなければ JST として扱う
 * 日付だけの場合は JST の 0:00 として扱う
 * @param datetime - 日時文字列（例: "2024-06-10T09:30"）
 * @returns 日時
 */
export function parsePostbackDatetime(datetime: string): Date {
  if (HAS_TIMEZONE.test(datetime)) {
    return new Date(datetime);
  }
  return new Date(`${datetime.includes('T') ? datetime : `${datetime}T00:00`}+09:00`);
}
