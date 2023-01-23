import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

export function groupBy<T, K extends keyof T>(list: T[], key: K): { [key: string]: T[] } {
  return list.reduce((acc, item) => {
    const group = item[key] as string;
    acc[group] = acc[group] || [];
    acc[group].push(item);
    return acc;
  }, {} as { [key: string]: T[] });
}

export function sortByNumber(a: number, b: number): number {
  return a - b;
}

export function sortByString(a: string, b: string): number {
  return a.localeCompare(b)
}

export function sortByDate(a: PlainDate, b: PlainDate): number {
  return PlainDate.compare(a, b);
}
