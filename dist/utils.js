"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.hankakuKana2Zenkakukana = exports.zenkakuNum2HankakuNum = exports.katakana2Hiragana = exports.isWeekday = void 0;
const japanese_holidays_1 = __importDefault(require("japanese-holidays"));
/**
 * 与えられた日付が平日かどうかを判定する
 * @param date 判定対象日付
 */
const isWeekday = (date) => {
    if (date.getDay() === 0 || date.getDay() === 6)
        return false;
    else
        return !japanese_holidays_1.default.isHoliday(date);
};
exports.isWeekday = isWeekday;
/**
 * カタカナをひらがなに変換する
 * @param str 変換対象文字列
 */
const katakana2Hiragana = (str) => str.replace(/[\u30a1-\u30f6]/g, (m) => String.fromCharCode(m.charCodeAt(0) - 0x60));
exports.katakana2Hiragana = katakana2Hiragana;
/**
 * 全角数字を半角数字に変換する
 * @param str 変換対象文字列
 */
const zenkakuNum2HankakuNum = (str) => str.replace(/[０-９]/g, (s) => String.fromCharCode(s.charCodeAt(0) - 0xfee0));
exports.zenkakuNum2HankakuNum = zenkakuNum2HankakuNum;
/**
 * 半角かな文字を全角かな文字に変換する
 * @param str 変換対象文字列
 */
const hankakuKana2Zenkakukana = (str) => {
    const kanaMap = {
        ｶﾞ: 'ガ',
        ｷﾞ: 'ギ',
        ｸﾞ: 'グ',
        ｹﾞ: 'ゲ',
        ｺﾞ: 'ゴ',
        ｻﾞ: 'ザ',
        ｼﾞ: 'ジ',
        ｽﾞ: 'ズ',
        ｾﾞ: 'ゼ',
        ｿﾞ: 'ゾ',
        ﾀﾞ: 'ダ',
        ﾁﾞ: 'ヂ',
        ﾂﾞ: 'ヅ',
        ﾃﾞ: 'デ',
        ﾄﾞ: 'ド',
        ﾊﾞ: 'バ',
        ﾋﾞ: 'ビ',
        ﾌﾞ: 'ブ',
        ﾍﾞ: 'ベ',
        ﾎﾞ: 'ボ',
        ﾊﾟ: 'パ',
        ﾋﾟ: 'ピ',
        ﾌﾟ: 'プ',
        ﾍﾟ: 'ペ',
        ﾎﾟ: 'ポ',
        ｳﾞ: 'ヴ',
        ﾜﾞ: 'ヷ',
        ｦﾞ: 'ヺ',
        ｱ: 'ア',
        ｲ: 'イ',
        ｳ: 'ウ',
        ｴ: 'エ',
        ｵ: 'オ',
        ｶ: 'カ',
        ｷ: 'キ',
        ｸ: 'ク',
        ｹ: 'ケ',
        ｺ: 'コ',
        ｻ: 'サ',
        ｼ: 'シ',
        ｽ: 'ス',
        ｾ: 'セ',
        ｿ: 'ソ',
        ﾀ: 'タ',
        ﾁ: 'チ',
        ﾂ: 'ツ',
        ﾃ: 'テ',
        ﾄ: 'ト',
        ﾅ: 'ナ',
        ﾆ: 'ニ',
        ﾇ: 'ヌ',
        ﾈ: 'ネ',
        ﾉ: 'ノ',
        ﾊ: 'ハ',
        ﾋ: 'ヒ',
        ﾌ: 'フ',
        ﾍ: 'ヘ',
        ﾎ: 'ホ',
        ﾏ: 'マ',
        ﾐ: 'ミ',
        ﾑ: 'ム',
        ﾒ: 'メ',
        ﾓ: 'モ',
        ﾔ: 'ヤ',
        ﾕ: 'ユ',
        ﾖ: 'ヨ',
        ﾗ: 'ラ',
        ﾘ: 'リ',
        ﾙ: 'ル',
        ﾚ: 'レ',
        ﾛ: 'ロ',
        ﾜ: 'ワ',
        ｦ: 'ヲ',
        ﾝ: 'ン',
        ｧ: 'ァ',
        ｨ: 'ィ',
        ｩ: 'ゥ',
        ｪ: 'ェ',
        ｫ: 'ォ',
        ｯ: 'ッ',
        ｬ: 'ャ',
        ｭ: 'ュ',
        ｮ: 'ョ',
        '｡': '。',
        '､': '、',
        ｰ: 'ー',
        '｢': '「',
        '｣': '」',
        '･': '・',
    };
    const reg = new RegExp(`(${Object.keys(kanaMap).join('|')})`, 'g');
    return str
        .replace(reg, (m) => kanaMap[m])
        .replace(/ﾞ/g, '゛')
        .replace(/ﾟ/g, '゜');
};
exports.hankakuKana2Zenkakukana = hankakuKana2Zenkakukana;
