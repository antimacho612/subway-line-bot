import STATIONS from './constants/stations';
import type { Station } from './types';
import { hankakuKanaToZenkakuKana, katakanaToHiragana, zenkakuNumToHankakuNum } from './utils';

/**
 * IDから時刻表を取得する駅を決定する
 * @param id - 駅のID
 * @returns 駅情報、該当なしの場合はundefined
 */
export function specifyStationById(id: string): Station | undefined {
  return STATIONS.find((station) => station.id === id);
}

/**
 * 表記ゆれを吸収する（前後の空白除去・全角数字→半角・半角カナ→全角・カタカナ→ひらがな）
 * @param name - 対象の文字列
 * @returns 表記をそろえた文字列
 */
function unifyNotation(name: string): string {
  return katakanaToHiragana(hankakuKanaToZenkakuKana(zenkakuNumToHankakuNum(name.trim())));
}

/** 表記をそろえた別名 → 駅の一覧 */
const STATIONS_BY_NAME = new Map<string, Station[]>();
for (const station of STATIONS) {
  for (const commonName of new Set(station.commonNames.map(unifyNotation))) {
    STATIONS_BY_NAME.set(commonName, [...(STATIONS_BY_NAME.get(commonName) ?? []), station]);
  }
}

/**
 * 指定された名前から時刻表を取得する駅を決定する
 * @param name - 判断対象となる名前（正式名称／一般名／略称など）
 * @returns 駅情報の配列、一致しない場合は空配列
 */
export function specifyStationsByName(name: string): Station[] {
  return STATIONS_BY_NAME.get(normalizeStationName(name)) ?? [];
}

/**
 * 駅名の入力を照合用の形式に正規化する
 * 末尾の「駅」「えき」は、除去前の文字列が別名に一致しない場合のみ除去する（「札駅」対策）
 * @param name - 正規化対象の名前
 * @returns 正規化後の文字列
 */
export function normalizeStationName(name: string): string {
  const buf = unifyNotation(name);
  if (STATIONS_BY_NAME.has(buf)) {
    return buf;
  }

  const stripped = buf.replace(/(駅|えき)$/, '');
  return stripped === '' ? buf : stripped;
}
