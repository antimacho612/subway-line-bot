import { describe, expect, test } from 'vitest';
import STATIONS from '../src/constants/stations';
import TIMETABLES from '../src/constants/timetables';

const diagramsOf = TIMETABLES.flatMap((timetable) =>
  (['weekdayDiagrams', 'holidayDiagrams'] as const).flatMap((kind) =>
    timetable[kind].map((diagram) => ({ label: `${timetable.id} ${kind} ${diagram.direction}`, diagram }))
  )
);

describe('時刻表データの整合性', () => {
  test('時刻表のIDと駅のIDが一致する', () => {
    expect(TIMETABLES.map((t) => t.id).sort()).toEqual(STATIONS.map((s) => s.id).sort());
  });

  test('時刻表のIDに重複がない', () => {
    const ids = TIMETABLES.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  test('すべての駅に平日・休日ダイヤの方面がある', () => {
    for (const t of TIMETABLES) {
      expect(t.weekdayDiagrams.length, `${t.id} weekday`).toBeGreaterThan(0);
      expect(t.holidayDiagrams.length, `${t.id} holiday`).toBeGreaterThan(0);
    }
  });

  test('分が60未満である', () => {
    const invalid = diagramsOf.flatMap(({ label, diagram }) =>
      diagram.arrivals.filter(({ time }) => time % 100 >= 60).map(({ time }) => `${label}: ${time}`)
    );
    expect(invalid).toEqual([]);
  });

  test('発車時刻が昇順（重複なし）である', () => {
    const unsorted = diagramsOf.flatMap(({ label, diagram }) =>
      diagram.arrivals.flatMap(({ time }, i) =>
        i > 0 && time <= diagram.arrivals[i - 1].time ? [`${label}: ${diagram.arrivals[i - 1].time} → ${time}`] : []
      )
    );
    expect(unsorted).toEqual([]);
  });
});
