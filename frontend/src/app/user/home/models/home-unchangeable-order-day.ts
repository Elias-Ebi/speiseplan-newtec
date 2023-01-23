import { Temporal } from "@js-temporal/polyfill";
import { Order } from "../../../shared/models/order";
import PlainDate = Temporal.PlainDate;

export interface HomeUnchangeableOrderDay {
  date: PlainDate;
  orders: Order[];
}
