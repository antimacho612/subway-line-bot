import * as stations from '../src/stations';

test('specifyStationById関数', () => {
  expect(stations.specifyStationById('')).toBeUndefined();
  expect(stations.specifyStationById('麻生駅')).toBeUndefined();
  expect(stations.specifyStationById('A')).toBeUndefined();
  expect(stations.specifyStationById('N00')).toBeUndefined();
  expect(stations.specifyStationById('N8')).toBeUndefined();
  expect(stations.specifyStationById('N18')).toBeUndefined();

  expect(stations.specifyStationById('N01')?.officialName).toBe('麻生駅');
  expect(stations.specifyStationById('N16')?.officialName).toBe('真駒内駅');
  expect(stations.specifyStationById('T01')?.officialName).toBe('宮の沢駅');
  expect(stations.specifyStationById('T19')?.officialName).toBe('新さっぽろ駅');
  expect(stations.specifyStationById('H01')?.officialName).toBe('栄町駅');
  expect(stations.specifyStationById('H14')?.officialName).toBe('福住駅');
});

test('specifyStationsByName関数', () => {
  expect(stations.specifyStationsByName('').map((s) => s.officialName)).toEqual([]);
  expect(stations.specifyStationsByName('えき').map((s) => s.officialName)).toEqual([]);
  expect(stations.specifyStationsByName('駅').map((s) => s.officialName)).toEqual([]);
  expect(stations.specifyStationsByName('エキ').map((s) => s.officialName)).toEqual([]);
  expect(stations.specifyStationsByName('さ').map((s) => s.officialName)).toEqual([]);
  expect(stations.specifyStationsByName('sapporo').map((s) => s.officialName)).toEqual([]);

  expect(stations.specifyStationsByName('さっぽろ駅').map((s) => s.officialName)).toEqual(['さっぽろ駅', 'さっぽろ駅']);
  expect(stations.specifyStationsByName('札幌').map((s) => s.officialName)).toEqual(['さっぽろ駅', 'さっぽろ駅']);
  expect(stations.specifyStationsByName('さっぽろ').map((s) => s.officialName)).toEqual(['さっぽろ駅', 'さっぽろ駅']);
  expect(stations.specifyStationsByName('サッポロ').map((s) => s.officialName)).toEqual(['さっぽろ駅', 'さっぽろ駅']);
  expect(stations.specifyStationsByName('ｻｯﾎﾟﾛ').map((s) => s.officialName)).toEqual(['さっぽろ駅', 'さっぽろ駅']);
});
