import STATIONS from './constants/stations';
import { hankakuKana2Zenkakukana, katakana2Hiragana, zenkakuNum2HankakuNum } from './utils';
import { Station } from './types';

/**
 * IDから時刻表を取得する駅を決定します。
 * @param id 駅のID。
 */
export const specifyStationById = (id: string) => STATIONS.find((station) => station.id === id);

/**
 * 指定された名前から時刻表を取得する駅を決定します。
 * @param name 判断対象となる名前（正式名称／一般名／略称など）
 */
export const specifyStationsByName = (name: string): Station[] => {
  let buf = name.trim();
  buf = zenkakuNum2HankakuNum(buf);
  buf = hankakuKana2Zenkakukana(buf);
  buf = katakana2Hiragana(buf);

  if (buf.endsWith('駅')) buf = buf.slice(0, -1);
  else if (buf.endsWith('えき')) buf = buf.slice(0, -2);

  return STATIONS.filter((station) => station.commonNames.includes(buf));
};
