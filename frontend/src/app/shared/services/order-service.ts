import { Injectable } from "@angular/core";
import { Temporal } from "@js-temporal/polyfill";

@Injectable({
    providedIn: 'root',
})
export class OrderService {
    orders: any[] = []

    constructor() {
        // use dummy values
        this.orders = [
            {
              date: Temporal.Now.plainDateISO(),
              buyer: "Max Mustermann",
              meals: "Salat",
              guest: "",
              amount: 7
            },
            {
              date: Temporal.Now.plainDateISO(),
              buyer: "Max Mustermann",
              meals: "Fleischküchle",
              guest: "",
              amount: 3.5
            },
            {
              date: Temporal.Now.plainDateISO(),
              buyer: "Max Mustermann",
              meals: "Burger",
              guest: "",
              amount: 3.5
            },
            {
              date: Temporal.Now.plainDateISO(),
              buyer: "Max Mustermann",
              meals: "Salat",
              guest: "Tim Mayer",
              amount: 3.5
            },
            {
              date: Temporal.Now.plainDateISO(),
              buyer: "Max Mustermann",
              meals: "Pommes",
              guest: "Lisa Müller",
              amount: 3.5
            },
            {
              date: Temporal.Now.plainDateISO(),
              buyer: "Max Mustermann",
              meals: "Schnitzel",
              guest: "",
              amount: 3.5
            },
            {
              date: Temporal.Now.plainDateISO(),
              buyer: "Max Mustermann",
              meals: "Spaghetti",
              guest: "",
              amount: 3.5
            }
          ];
    }


    getAllOrders() {
        return this.orders;
    }

}