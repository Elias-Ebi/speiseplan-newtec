import { Injectable } from "@angular/core";
import { Temporal } from "@js-temporal/polyfill";
import { ApiService } from "./api.service";

// TODO: remove file
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  orders: any[] = []

  constructor(private apiService: ApiService) {

    // use dummy values
    /*
    this.orders = [
      {
        date: new Temporal.PlainDate(2022, 8, 8),
        buyer: "Max Mustermann",
        meals: "Salat",
        guest: "",
        amount: 7
      },
      {
        date: new Temporal.PlainDate(2022, 8, 8),
        buyer: "Fritz Tupu",
        meals: "Fleischküchle",
        guest: "",
        amount: 3.5
      },
      {
        date: new Temporal.PlainDate(2022, 8, 8),
        buyer: "Helena Reichel",
        meals: "Burger",
        guest: "",
        amount: 3.5
      },
      {
        date: new Temporal.PlainDate(2022, 8, 8),
        buyer: "Max Mustermann",
        meals: "Salat",
        guest: "Tim Mayer",
        amount: 3.5
      },
      {
        date: new Temporal.PlainDate(2022, 8, 8),
        buyer: "Max Mustermann",
        meals: "Pommes",
        guest: "Lisa Müller",
        amount: 3.5
      },
      {
        date: new Temporal.PlainDate(2022, 8, 8),
        buyer: "Max Mustermann",
        meals: "Schnitzel",
        guest: "",
        amount: 3.5
      },
      {
        date: new Temporal.PlainDate(2022, 8, 8),
        buyer: "Helena Stumpf",
        meals: "Spaghetti",
        guest: "",
        amount: 3.5
      }
    ];
    */

    this.orders.forEach(element => {
      // element.date = element.date.toString();
    });
  }

  async ngOnInit(): Promise<void> {
    const openOrders = await this.apiService.getOpenOrders();
    this.orders = openOrders;
  }


  getAllOrders() {
    return this.orders;
  }

}
