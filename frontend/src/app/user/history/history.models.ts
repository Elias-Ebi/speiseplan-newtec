import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

export interface HistoryOrderMonth {
  date: PlainDate;
  days: HistoryOrderDay[];
  total: number;
  paid: boolean;
}

export interface HistoryOrderDay {
  date: PlainDate;
  mealCount: number;
  mealNames: string[];
  total: number;
}
