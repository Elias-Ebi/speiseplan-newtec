import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

export function sortByNumber(a: number, b: number): number {
  return a - b;
}

export function sortByString(a: string, b: string): number {
  return a.localeCompare(b)
}

export function sortByDate(a: PlainDate, b: PlainDate): number {
  return PlainDate.compare(a, b);
}
