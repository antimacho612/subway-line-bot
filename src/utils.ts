import JapaneseHolidays from 'japanese-holidays';
import type { PlainDate } from './types';

/**
 * 年月日の曜日を取得する
 * @param date 対象の年月日
 * @returns 曜日（0: 日曜 〜 6: 土曜）
 */
export function getDayOfWeek(date: PlainDate): number {
  return new Date(Date.UTC(date.year, date.month - 1, date.day)).getUTCDay();
}

/**
 * 与えられた日付が平日かどうかを判定する
 * @param date 判定対象日付
 * @returns 平日であればtrue、休日であればfalse
 */
export function isWeekday(date: PlainDate): boolean {
  const dayOfWeek = getDayOfWeek(date);
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return false;
  } else {
    // isHolidayAt は JST で判定するため、UTC 0:00（JST 9:00）を渡せば同じ日付になる
    return !JapaneseHolidays.isHolidayAt(new Date(Date.UTC(date.year, date.month - 1, date.day)));
  }
}

/**
 * カタカナをひらがなに変換する（地名で使う「ヶ」「ヵ」は変換しない）
 * @param str 変換対象文字列
 * @return 変換後文字列
 */
export function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f4]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0x60));
}

/**
 * 全角数字を半角数字に変換する
 * @param str 変換対象文字列
 */
export function zenkakuNumToHankakuNum(str: string): string {
  return str.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
}

/**
 * 半角かな文字を全角かな文字に変換する（濁点・半濁点は直前の文字と結合する）
 * @param str 変換対象文字列
 */
export function hankakuKanaToZenkakuKana(str: string): string {
  return str.replace(/[｡-ﾟ]+/g, (m) => m.normalize('NFKC'));
}
