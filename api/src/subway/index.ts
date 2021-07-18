import { WebhookEvent, FlexMessage, TextMessage } from '@line/bot-sdk'
import { zenkakuNum2HankakuNum, hankakuKana2Zenkakukana, katakana2Hiragana, isNotNullOrUndefined } from '../common/utils'
import { stationNotFoundErrorMessage } from './message/templates/errorMessageTemplate'
import { Station, stations } from './data/stations'
import { getSubwayStationTimetable } from './getSubwayStationTimetables'
import { subwayStationTimetableMessageTemplate } from './message/templates/subwayStationTimetableMessageTemplate'

/**
 * 指定された名前から時刻表を取得する駅を決定します。
 * @param name 判断対象となる名前（正式名称／一般名／略称など）。
 */
const specifyStationsByName = (name: string) => {
  let buf = name.trim();
  buf = zenkakuNum2HankakuNum(buf);
  buf = hankakuKana2Zenkakukana(buf);
  buf = katakana2Hiragana(buf);

  if(buf.endsWith('駅')){
    buf = buf.slice(0,-1);
  } else if(buf.endsWith('えき')) {
    buf = buf.slice(0,-2);
  }

  return stations.filter(s => s.common_names.includes(buf))
}

const specifyStationsById = (id: string) => {
  return stations.filter(s => s.id === id);
}

/**
 * 
 * @param event 
 */
export const flexMessageTemplate = (event: WebhookEvent): FlexMessage | TextMessage => {
  try {
    // 入力内容から駅を特定する
    let stations: Station[];
    let dt: Date;

    if (event.type === 'message' && event.message.type === 'text') {
      stations = specifyStationsByName(event.message.text);
      dt = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
    } else if (event.type === 'postback' && event.postback.params?.datetime) {
      stations = specifyStationsById(event.postback.data);
      dt = new Date(event.postback.params.datetime);
    } else {
      throw new Error('This Event Type Is Not Supported.')
    }

    // 特定できなかったらエラーメッセージ返却
    if (stations.length === 0) { return stationNotFoundErrorMessage(); }

    //時刻表データを取得する
    const subwayStationTimetables = stations.map(s => getSubwayStationTimetable(s, dt)).filter(isNotNullOrUndefined);
    if (subwayStationTimetables.length === 0) { throw new Error('時刻表データの取得に失敗しました。'); }

    return subwayStationTimetableMessageTemplate(subwayStationTimetables);
  } catch (err) {
    throw err;
  }
}