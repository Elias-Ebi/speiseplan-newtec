import { Order } from "../../shared/models/order";
import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

export interface HomeOpenOrderDay {
  date: PlainDate;
  orders: Order[];
  mealNames: string[];
  guestCount: number;
}

export interface HomeQuickOrderMeal {
  id: string;
  icon: string;
  orderIndex: number;
  name: string;
  orderCount: number;
  description: string;
  ordered: boolean;
  orderId: string;
}

export interface HomeUnchangeableOrderDay {
  date: PlainDate;
  orders: Order[];
}
