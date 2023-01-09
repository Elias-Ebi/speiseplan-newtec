import { Temporal } from "@js-temporal/polyfill";

export interface Order {
    orderId: number;
    orderTotal: number;
    buyer: string;
    orderDate: Temporal.PlainDate;
    isGuestOrder: boolean;
    guestName: string | undefined;
    isOrderOffered: boolean;
}