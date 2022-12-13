import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { EuroPipe } from "../../shared/pipes/euro.pipe";
import { Temporal } from "@js-temporal/polyfill";
import { WeekdayNamePipe } from "../../shared/pipes/weekday-name.pipe";
import { MatTabsModule } from "@angular/material/tabs";
import { MonthNamePipe } from "../../shared/pipes/month-name.pipe";

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatIconModule, EuroPipe, WeekdayNamePipe, MatTabsModule, MonthNamePipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HistoryComponent {
  orders = [
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Bratlinge", "Salat"],
      amount: 7
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Fleischküchle"],
      amount: 3.5
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Burger"],
      amount: 3.5
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Salat"],
      amount: 3.5
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Pommes"],
      amount: 3.5
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Schnitzel"],
      amount: 3.5
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Spaghetti"],
      amount: 3.5
    }
  ];

  historyData = [
    {
      date: Temporal.PlainDate.from("2022-12-01"),
      orders: this.orders,
      total: 35.5
    },
    {
      date: Temporal.PlainDate.from("2022-11-01"),
      orders: this.orders,
      total: 50
    },
    {
      date: Temporal.PlainDate.from("2022-10-01"),
      orders: this.orders,
      total: 32.5
    },
    {
      date: Temporal.PlainDate.from("2022-09-01"),
      orders: this.orders,
      total: 12.5
    },
    {
      date: Temporal.PlainDate.from("2022-08-01"),
      orders: this.orders,
      total: 25
    },
    {
      date: Temporal.PlainDate.from("2022-07-01"),
      orders: this.orders,
      total: 42.5
    },
  ];
}
