import { Temporal } from "@js-temporal/polyfill";
import { Order } from "../../shared/models/order";
import PlainDate = Temporal.PlainDate;

export interface OrderDay {
  date: PlainDate,
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

export interface GuestOrderCancelDialogValues {
  date: PlainDate;
  orderId: string;
}
