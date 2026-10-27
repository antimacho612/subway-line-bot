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
 * 指定された名前から時刻表を取得する駅を決定する
 * @param name - 判断対象となる名前（正式名称／一般名／略称など）
 * @returns 駅情報の配列、一致しない場合は空配列
 */
export function specifyStationsByName(name: string): Station[] {
  const buf = normalizeStationName(name);

  return STATIONS.filter((station) => station.commonNames.includes(buf));
}

/**
 * 駅名の入力を照合用の形式に正規化する
 * 末尾の「駅」「えき」は、除去前の文字列が別名に一致しない場合のみ除去する（「札駅」対策）
 * @param name - 正規化対象の名前
 * @returns 正規化後の文字列
 */
export function normalizeStationName(name: string): string {
  const buf = katakanaToHiragana(hankakuKanaToZenkakuKana(zenkakuNumToHankakuNum(name.trim())));
  if (STATIONS.some((station) => station.commonNames.includes(buf))) {
    return buf;
  }

  const stripped = buf.replace(/(駅|えき)$/, '');
  return stripped === '' ? buf : stripped;
}
