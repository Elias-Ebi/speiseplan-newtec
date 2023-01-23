import { Temporal } from "@js-temporal/polyfill";
import { Order } from "../../../shared/models/order";
import PlainDate = Temporal.PlainDate;

export interface HomeOpenOrderDay {
  date: PlainDate;
  orders: Order[];
  mealNames: string[];
  guestCount: number;
}
