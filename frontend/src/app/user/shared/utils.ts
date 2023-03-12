import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;
import PlainYearMonth = Temporal.PlainYearMonth;

export function groupBy<T>(arr: T[], key: keyof T): Map<string, T[]> {
  const grouped = new Map<string, T[]>();
  arr.forEach((item) => {
    const keyValue = (item[key] as unknown as object).toString();
    if (!grouped.has(keyValue)) {
      grouped.set(keyValue, []);
    }
    grouped.get(keyValue)?.push(item);
  });

  return grouped;
}

export function sortByNumber(a: number, b: number): number {
  return a - b;
}

export function sortByString(a: string, b: string): number {
  return a?.localeCompare(b) || -1;
}

export function sortByDate(a: PlainDate, b: PlainDate): number {
  return PlainDate.compare(a, b);
}

export function sortByYearMonth(a: PlainYearMonth, b: PlainYearMonth): number {
  return PlainYearMonth.compare(a, b);
}
