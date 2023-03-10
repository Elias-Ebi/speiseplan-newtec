import { Temporal } from "@js-temporal/polyfill";
import { Order } from "../../shared/models/order";

export interface OrderDay {
  date: Temporal.PlainDate,
  orderMeals: OrderMeal[],
  guestOrders: Order[],
  anyOrders: boolean,
}

export interface OrderMeal {
  id: string;
  icon: string;
  orderIndex: number;
  name: string;
  orderCount: number;
  description: string;
  ordered: boolean;
  orderId: string;
}

export interface GuestOrderDialogValues {
  guestName: string,
  mealIds: string[]
}
