import { describe, expect, test } from 'vitest';
import * as utils from '../src/utils';

describe('isWeekday関数', () => {
  // 平日（月〜金）に当たる祝日・振替休日で、曜日判定ではなく祝日判定を検証する
  test('2023/1/9（成人の日・月）は祝日判定', () => {
    expect(utils.isWeekday(new Date(2023, 0, 9))).toBe(false);
  });
  test('2022/3/21（春分の日・月）は祝日判定', () => {
    expect(utils.isWeekday(new Date(2022, 2, 21))).toBe(false);
  });
  test('2024/11/4（振替休日・月）は祝日判定', () => {
    expect(utils.isWeekday(new Date(2024, 10, 4))).toBe(false);
  });
  test('土曜・日曜は休日判定', () => {
    expect(utils.isWeekday(new Date(2022, 0, 1))).toBe(false); // 土
    expect(utils.isWeekday(new Date(2023, 0, 8))).toBe(false); // 日
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
