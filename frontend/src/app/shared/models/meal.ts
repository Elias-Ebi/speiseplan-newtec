import { Temporal } from "@js-temporal/polyfill";

export interface Meal {
    mealId: string;
    mealName: string;
    mealDescription: string;
    mealPrice: number;
    mealDate: Temporal.PlainDate;
}