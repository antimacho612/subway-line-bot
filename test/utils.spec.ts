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

test('katakana2Hiragana関数', () => {
  expect(
    utils.katakana2Hiragana(
      'ァアィイゥウェエォオカガキギクグケゲコゴサザシジスズセゼソゾタダチヂッツヅテデトドナニヌネノハバパヒビピフブプヘベペホボポマミムメモャヤュユョヨラリルレロヮワヰヱヲンヴヵヶ'
    )
  ).toBe(
    'ぁあぃいぅうぇえぉおかがきぎくぐけげこごさざしじすずせぜそぞただちぢっつづてでとどなにぬねのはばぱひびぴふぶぷへべぺほぼぽまみむめもゃやゅゆょよらりるれろゎわゐゑをんゔゕゖ'
  );
});

test('zenkakuNum2HankakuNum関数', () => {
  expect(utils.zenkakuNum2HankakuNum('１２３４５６７８９０')).toBe('1234567890');
});

test('hankakuKana2Zenkakukana関数', () => {
  expect(
    utils.hankakuKana2Zenkakukana(
      'ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞﾜﾞｦﾞｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮ｡､ｰ｢｣･'
    )
  ).toBe(
    'ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴヷヺアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォッャュョ。、ー「」・'
  );
});
