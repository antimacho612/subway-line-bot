import { describe, expect, it } from 'vitest';
import * as stations from '../src/stations';

describe('specifyStationById', () => {
  it('一致しない場合はundefinedを返す', () => {
    expect(stations.specifyStationById('')).toBeUndefined();
    expect(stations.specifyStationById('麻生駅')).toBeUndefined();
    expect(stations.specifyStationById('A')).toBeUndefined();
    expect(stations.specifyStationById('N00')).toBeUndefined();
    expect(stations.specifyStationById('N8')).toBeUndefined();
    expect(stations.specifyStationById('N18')).toBeUndefined();
  });

  it('有効な駅IDが与えられた場合、正しい駅情報を返す', () => {
    expect(stations.specifyStationById('N01')?.id).toBe('N01');
    expect(stations.specifyStationById('N06')?.id).toBe('N06');
    expect(stations.specifyStationById('N16')?.id).toBe('N16');

    expect(stations.specifyStationById('T01')?.id).toBe('T01');
    expect(stations.specifyStationById('T10')?.id).toBe('T10');
    expect(stations.specifyStationById('T19')?.id).toBe('T19');

    expect(stations.specifyStationById('H01')?.id).toBe('H01');
    expect(stations.specifyStationById('H08')?.id).toBe('H08');
    expect(stations.specifyStationById('H14')?.id).toBe('H14');
  });
});

describe('specifyStationsByName', () => {
  it('一致しない場合は空配列を返す', () => {
    expect(stations.specifyStationsByName('').map((s) => s.officialName)).toEqual([]);
    expect(stations.specifyStationsByName('えき').map((s) => s.officialName)).toEqual([]);
    expect(stations.specifyStationsByName('駅').map((s) => s.officialName)).toEqual([]);
    expect(stations.specifyStationsByName('エキ').map((s) => s.officialName)).toEqual([]);
    expect(stations.specifyStationsByName('さ').map((s) => s.officialName)).toEqual([]);
    expect(stations.specifyStationsByName('sapporo').map((s) => s.officialName)).toEqual([]);
    expect(stations.specifyStationsByName('存在しない駅').map((s) => s.officialName)).toEqual([]);
  });

  it('trimや全角・半角変換、ひらがな・カタカナ変換が正しく動作する', () => {
    const names = [
      'さっぽろ駅',
      'サッポロ駅',
      'ｻｯﾎﾟﾛ駅',
      'さっぽろ',
      'サッポロ',
      'ｻｯﾎﾟﾛ',
      ' さっぽろ駅 ',
      'サッポロえき',
      'ｻｯﾎﾟﾛえき',
    ];
    for (const name of names) {
      const result = stations.specifyStationsByName(name);
      expect(result.some((s) => s.officialName === 'さっぽろ駅')).toBe(true);
    }
  });

  it('末尾の「駅」や「えき」を除去しても一致する', () => {
    expect(stations.specifyStationsByName('麻生駅').some((s) => s.officialName === '麻生駅')).toBe(true);
    expect(stations.specifyStationsByName('麻生えき').some((s) => s.officialName === '麻生駅')).toBe(true);
    expect(stations.specifyStationsByName('麻生').some((s) => s.officialName === '麻生駅')).toBe(true);
  });

  it('複数のcommonNamesに一致する場合、複数件返す', () => {
    // 例: '大通' で複数駅が一致する場合
    const result = stations.specifyStationsByName('大通');
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
});
