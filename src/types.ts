export type LineId = 'N' | 'T' | 'H';

export type Line = {
  id: LineId;
  name: string;
  themeColor: string;
};

export type Station = {
  id: string;
  lineId: LineId;
  officialName: string;
  commonNames: string[];
  url: string;
};

export type Arrival = {
  time: number;
  note?: string;
};

export type Diagram = {
  direction: string;
  arrivals: Arrival[];
};

export type Timetable = {
  id: string;
  weekdayDiagrams: Diagram[];
  holidayDiagrams: Diagram[];
};

export type DiagramsMessageData = {
  station: Station;
  line: Line;
  referenceDatetime: Date;
  diagrams: Diagram[];
};

/** タイムゾーンを持たない年月日 */
export type PlainDate = {
  year: number;
  /** 月（1〜12） */
  month: number;
  /** 日（1〜31） */
  day: number;
};
