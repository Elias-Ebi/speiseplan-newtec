import { Temporal } from "@js-temporal/polyfill";
import { Order } from "../../../shared/models/order";
import { OrderMeal } from "./order-meal";

export interface OrderDay {
  date: Temporal.PlainDate,
  orderMeals: OrderMeal[],
  guestOrders: Order[],
}
