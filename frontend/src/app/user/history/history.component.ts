import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { EuroPipe } from "../../shared/pipes/euro.pipe";
import { WeekdayNamePipe } from "../../shared/pipes/weekday-name.pipe";
import { MatTabsModule } from "@angular/material/tabs";
import { MonthNamePipe } from "../../shared/pipes/month-name.pipe";
import { HistoryOrderDay, HistoryOrderMonth } from "./history.models";
import { FullDatePipe } from "../../shared/pipes/full-date.pipe";
import { ApiService } from "../../shared/services/api.service";
import { OrderMonth } from "../../shared/models/order-month";
import { Temporal } from "@js-temporal/polyfill";
import { Order } from "../../shared/models/order";
import { groupBy, sortByDate } from "../shared/utils";
import PlainDate = Temporal.PlainDate;


@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, MatIconModule, EuroPipe, WeekdayNamePipe, MatTabsModule, MonthNamePipe, FullDatePipe],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  months: HistoryOrderMonth[] = [];

  constructor(private apiService: ApiService) {
  }

  async ngOnInit(): Promise<void> {
    const orderMonths = await this.apiService.getHistory();
    this.months = this.transformMonths(orderMonths);
  }

  private transformMonths(orderMonths: OrderMonth[]): HistoryOrderMonth[] {
    return orderMonths.map((orderMonth) => {
      return {
        date: PlainDate.from({year: orderMonth.year, month: orderMonth.month, day: 1}),
        days: this.transformOrderDays(orderMonth.orders),
        total: orderMonth.total,
      };
    }).sort((a, b) => sortByDate(a.date, b.date)).reverse();
  }

  private transformOrderDays(orders: Order[]): HistoryOrderDay[] {
    const groupedOrders = groupBy<Order>(orders, 'date');
    const groupedOrdersArray = Array.from(groupedOrders.entries());

    return groupedOrdersArray.map(([date, dayOrders]) => {
      const mealCount = dayOrders.length;
      const mealNames = dayOrders.map(order => order.meal.name);
      const total = dayOrders.map(order => order.meal.total).reduce((acc, val) => acc + val, 0);

      return {
        date: PlainDate.from(date),
        mealCount,
        mealNames,
        total
      };
    }).sort((a, b) => sortByDate(b.date, a.date)).reverse();
  }
}
