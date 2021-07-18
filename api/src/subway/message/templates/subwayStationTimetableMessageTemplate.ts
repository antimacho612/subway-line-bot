import { FlexMessage, FlexBubble, FlexBox } from '@line/bot-sdk'

// Interfaces
export interface Arrival {
  time: number,
  note?: string
}

export interface Timetable {
  direction: string,
  arrivals: Arrival[]
}

export interface SubwayStationTimetable {
  id: string,
  line_id: 'N' | 'T' | 'H',
  line_name: '南北線' | '東西線' | '東豊線'
  name: string,
  dateTime: Date,
  isWeekday: boolean,
  timetables: Timetable[]
}

const getImageColor = (line: string): string => line === 'N' ? '#008000' : line === 'T' ? '#E46C0A' : '#1D1DFF';

const format24DateTime = (dt: Date): string => {
  let tmpDate = dt;
  let hour = dt.getHours();

  // 0時の時は24時間表記にするために1日前に戻す
  if (hour === 0) {
    tmpDate.setDate(tmpDate.getDate() - 1);
    hour = 24;
  }

  //MM月DD日（曜） HH時mm分
  return `${ (tmpDate.getMonth() + 1).toString().padStart(2) }月${ tmpDate.getDate().toString().padStart(2) }日（${ [ '日', '月', '火', '水', '木', '金', '土' ][tmpDate.getDay()] }） ${ hour.toString().padStart(2) }時${ tmpDate.getMinutes().toString().padStart(2, '0')}分`;
}

const formatNumTime = (time: number) => {
  const str = ((time < 2400) ? time : time - 2400).toString().padStart(4, '0');
  return `${ parseInt(str.substr(0, 2)) }時${ str.substr(2, 2) }分`
}

const bubbleHeaderTemplate = (data: SubwayStationTimetable): FlexBox => ({
  type: 'box',
  layout: 'horizontal',
  contents: [
    {
      type: 'box',
      layout: 'horizontal',
      contents: [
        {
          type: 'box',
          layout: 'horizontal',
          contents: [],
          backgroundColor: '#FFFFFF',
          cornerRadius: '24px',
          borderColor: getImageColor(data.line_id),
          borderWidth: 'medium',
          width: '24px',
          paddingAll: '14px',
          height: '24px',
          offsetStart: '2px'
        },
        {
          type: 'box',
          layout: 'horizontal',
          contents: [
            {
              type: 'text',
              text: data.id,
              color: getImageColor(data.line_id),
              weight: 'bold',
              size: '14px',
              align: 'center',
              gravity: 'center'
            }
          ],
          width: '36px',
          height: '36px',
          borderWidth: 'medium',
          borderColor: '#FFFFFF',
          cornerRadius: '24px',
          offsetStart: '-32px'
        }
      ],
      alignItems: 'center',
      flex: 1,
      offsetTop: '6px'
    },
    {
      type: 'text',
      text: data.name,
      weight: 'bold',
      color: '#FFFFFF',
      size: 'xl',
      flex: 4
    },
    {
      type: 'text',
      text: data.line_name,
      position: 'absolute',
      color: '#FFFFFF',
      weight: 'regular',
      offsetTop: '2px',
      offsetStart: '16px',
      size: '10px'
    }
  ],
  backgroundColor: getImageColor(data.line_id),
  height: '56px',
  alignItems: 'center'
});

const mainContentTemplate = (timetable: Timetable) : FlexBox => ({
  type: 'box',
  layout: 'vertical',
  contents: [
    {
      type: 'box',
      layout: 'baseline',
      spacing: 'sm',
      contents: [
        {
          type: 'text',
          text: '●' + timetable.direction,
          size: 'sm',
        }
      ]
    },
    {
      type: 'box',
      layout: 'baseline',
      contents: [
        {
          type: 'text',
          text: timetable.arrivals.length === 0 ? '運行は終了しています' : timetable.arrivals.map(a => formatNumTime(a.time) + (a.note ? `（※${ a.note }）` : '')).join('\n'),
          color: '#666666',
          size: 'sm',
          margin: 'xl',
          wrap: true
        }
      ]
    }
  ]
});

const bubbleBodyTemplate = (data: SubwayStationTimetable): FlexBox => (
  {
    type: 'box',
    layout: 'vertical',
    contents: [
      {
        type: 'text',
        text: format24DateTime(data.dateTime),
        weight: 'bold'
      },
      {
        type: 'box',
        layout: 'baseline',
        contents: [
          {
            type: 'text',
            text: data.isWeekday ? '平日ダイヤ' : '土日祝ダイヤ',
            size: 'sm',
            color: '#999999',
            margin: 'md',
            align: 'end'
          }
        ],
        margin: 'xs'
      },
      {
        type: 'box',
        layout: 'vertical',
        contents: data.timetables.map(timetable => mainContentTemplate(timetable)),
        spacing: 'sm'
      }
    ],
  }
);

const bubbleFooterTemplate = (data: SubwayStationTimetable): FlexBox => ({
  type: 'box',
  layout: 'vertical',
  contents: [
    {
      type: 'button',
      style: 'primary',
      action: {
        type: 'datetimepicker',
        label: '出発日時を指定する',
        data: data.id,
        mode: 'datetime'
      },
      height: 'sm',
      color: '#0286B2'
    }
  ]
});

const bubbleTemplate = (data: SubwayStationTimetable): FlexBubble => ({
  type: 'bubble',
  size: 'kilo',
  header: bubbleHeaderTemplate(data),
  body: bubbleBodyTemplate(data),
  footer: bubbleFooterTemplate(data),
  styles: {
    footer: {
      separator: true
    }
  }
})

export const subwayStationTimetableMessageTemplate = (dataArray: SubwayStationTimetable[]): FlexMessage => ({
  type: 'flex',
  altText: dataArray.map(data => data.name).shift() ?? '',
  contents: {
    type: 'carousel',
    contents: dataArray.map(data => bubbleTemplate(data)),
  },
});