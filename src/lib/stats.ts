export type Metrics = {
  average: number;
  min: number;
  max: number;
  count: number;
};

export type SeriesPoint = { date: string; miles: number };

import { RunRecord } from "./csv";

export function computeMetrics(records: RunRecord[]): Metrics {
  if (records.length === 0) return { average: 0, min: 0, max: 0, count: 0 };
  const milesArr = records.map((r) => r.miles);
  const total = milesArr.reduce((a, b) => a + b, 0);
  return {
    average: total / records.length,
    min: Math.min(...milesArr),
    max: Math.max(...milesArr),
    count: records.length,
  };
}

export function byPerson(records: RunRecord[]): Record<string, RunRecord[]> {
  return records.reduce((acc, r) => {
    (acc[r.person] ??= []).push(r);
    return acc;
  }, {} as Record<string, RunRecord[]>);
}

export function aggregateByDate(records: RunRecord[]): SeriesPoint[] {
  const map = new Map<string, number>();
  for (const r of records) {
    const key = r.date.toISOString().slice(0, 10);
    map.set(key, (map.get(key) ?? 0) + r.miles);
  }
  return Array.from(map.entries())
    .map(([date, miles]) => ({ date, miles }))
    .sort((a, b) => (a.date < b.date ? -1 : 1));
}
