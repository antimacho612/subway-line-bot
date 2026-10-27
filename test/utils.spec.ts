import { describe, expect, test } from 'vitest';
import * as utils from '../src/utils';

describe('isWeekday関数', () => {
  test('2022/1/1は祝日判定', () => {
    expect(utils.isWeekday(new Date(2022, 0, 1))).toBe(false);
  });
  test('2023/1/8は祝日判定', () => {
    expect(utils.isWeekday(new Date(2023, 0, 8))).toBe(false);
  });
  test('2022/3/21は祝日判定', () => {
    expect(utils.isWeekday(new Date(2022, 2, 21))).toBe(false);
  });

  test('2022/1/3は平日判定', () => {
    expect(utils.isWeekday(new Date(2022, 0, 3))).toBe(true);
  });
  test('2022/6/14は平日判定', () => {
    expect(utils.isWeekday(new Date(2022, 5, 14))).toBe(true);
  });
});

test('katakanaToHiragana関数', () => {
  expect(
    utils.katakanaToHiragana(
      'ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴ'
    )
  ).toBe(
    'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔ'
  );
});

test('katakanaToHiragana関数は「ヶ」「ヵ」を変換しない', () => {
  expect(utils.katakanaToHiragana('ヒバリヶ丘ヵ')).toBe('ひばりヶ丘ヵ');
});

test('zenkakuNumToHankakuNum関数', () => {
  expect(utils.zenkakuNumToHankakuNum('１２３４５６７８９０')).toBe('1234567890');
});

test('hankakuKanaToZenkakuKana関数', () => {
  expect(
    utils.hankakuKanaToZenkakuKana(
      'ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞﾜﾞｦﾞｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ｡､ｰ｢｣･'
    )
  ).toBe(
    'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴヷヺアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ。、ー「」・'
  );
});
