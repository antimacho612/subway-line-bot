import STATIONS from './constants/stations';
import type { Station } from './types';
import { hankakuKana2Zenkakukana, katakana2Hiragana, zenkakuNum2HankakuNum } from './utils';

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
  let buf = katakana2Hiragana(hankakuKana2Zenkakukana(zenkakuNum2HankakuNum(name.trim())));
  buf = buf.replace(/(駅|えき)$/, '');

  return STATIONS.filter((station) => station.commonNames.includes(buf));
}
