import { FlexMessage, TextMessage } from "@line/bot-sdk";
import { specifyStationById, specifyStationsByName } from "./data/stations";
import { getDiagrams } from "./data/timetables";
import { getLineById } from "./data/lines";
import { notSupportedMessageTypeErrorMessage, stationNotFoundErrorMessage } from "./messageTemplates/errorMessageTemplate";
import { SubwayStationDiagrams, subwayStationDiagramsMessageTemplate } from "./messageTemplates/subwayStationDiagramsMessageTemplate";

export const replyToTextMessage = (stationName: string): FlexMessage | TextMessage => {
  // 基準となる日時 = 現在日付
  const referenceDatetime = new Date(Date.now() + (new Date().getTimezoneOffset() + 9 * 60) * 60 * 1000);

  // 駅特定
  const stations = specifyStationsByName(stationName);
  if (!stations.length) {
    return stationNotFoundErrorMessage;
  }

  // 駅ごとに線の情報と時刻表を取得
  const stationDiagrams: SubwayStationDiagrams[] = stations.map((station) => {
    return {
      station: station,
      line: getLineById(station.lineId),
      referenceDatetime: referenceDatetime,
      diagrams: getDiagrams(station.id, referenceDatetime),
    };
  });

  // FlexMessage作成
  return subwayStationDiagramsMessageTemplate(stationDiagrams);
};

export const replyToPostbackMessage = (stationId: string, referenceDatetime: Date): FlexMessage | TextMessage => {
  // 駅特定
  const station = specifyStationById(stationId);
  if (!station) {
    return stationNotFoundErrorMessage;
  }

  // 線の情報と時刻表を取得
  const stationDiagrams: SubwayStationDiagrams = {
    station: station,
    line: getLineById(station.lineId),
    referenceDatetime: referenceDatetime,
    diagrams: getDiagrams(station.id, referenceDatetime),
  };

  return subwayStationDiagramsMessageTemplate([stationDiagrams]);
};

export const relpyToOtherMessage = () => notSupportedMessageTypeErrorMessage;
