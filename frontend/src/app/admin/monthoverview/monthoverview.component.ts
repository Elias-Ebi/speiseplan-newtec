import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {EuroPipe} from "../../shared/pipes/euro.pipe";
import {Temporal} from "@js-temporal/polyfill";
import {WeekdayNamePipe} from "../../shared/pipes/weekday-name.pipe";
import {MatTabsModule} from "@angular/material/tabs";
import {MonthNamePipe} from "../../shared/pipes/month-name.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {ApiService} from "../../shared/services/api.service";
import {Order} from "../../shared/models/order";
import {DateService} from "../../shared/services/date.service";
import {groupBy} from "../../user/shared/utils";
import {forEach} from "lodash";
import PlainDate = Temporal.PlainDate;
import {OrdersMonth} from "../../user/order/models/orders-month";

@Component({
  selector: 'app-monthoverview',
  standalone: true,
  imports: [CommonModule, MatIconModule, EuroPipe, WeekdayNamePipe, MatTabsModule, MonthNamePipe, MatButtonModule, MatInputModule, FormsModule, MatTableModule],
  templateUrl: './monthoverview.component.html',
  styleUrls: ['./monthoverview.component.scss']
})
export class MonthoverviewComponent implements OnInit {

  dataMap = new Map<PlainDate, [OrdersMonth]>();

  constructor(
    private apiService: ApiService,
    private dateService: DateService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const lastSixMonths = this.dateService.getLastSixMonths();
    const monthsOrder = [groupBy(await Promise.all(await this.apiService.getOrdersFromMonth(lastSixMonths[0])), 'profile')];
    for (let i = 1; 1 < 6; i++) {
      //group for user in Month-specific arrays
      monthsOrder.push(groupBy(await Promise.all(await this.apiService.getOrdersFromMonth(lastSixMonths[i])), 'profile'));
    }

    monthsOrder.forEach((month, outerIndex) => {
      //month x
      let temp: OrdersMonth[] = []

      //for each username in month
      Object.keys(month).forEach(userName => {
        let sumMeals = 0
        let sumBill = 0

        //for each order from specific user
        month[userName].forEach(order => {
          sumMeals += order.meal.orderCount
          sumBill += order.meal.total
        })
        temp.push({name: userName, numberOfMeals: sumMeals, totalBill: sumBill, isPaid: false})
      })

      //edgecase: what happens when temp is empty?
      // @ts-ignore
      this.dataMap.set(lastSixMonths[outerIndex], temp);

    })

  }

  customers = [
    {
      name: "Birgit Beispiel",
      count: 11,
      total: 62.20,
      paid: true
    },
    {
      name: "Adam Sandler",
      count: 2,
      total: 10.30,
      paid: false
    },
    {
      name: "Jumbo Schreiner",
      count: 41,
      total: 162.40,
      paid: true
    },
    {
      name: "Max Mustermann",
      count: 11,
      total: 62.20,
      paid: true
    },
    {
      name: "Rudolph Carell",
      count: 11,
      total: 62.20,
      paid: false
    },
    {
      name: "Moritz Bleibtreu",
      count: 11,
      total: 62.20,
      paid: true
    },
    {
      name: "Hans Bärlach",
      count: 18,
      total: 82.90,
      paid: true
    }
  ]


  /*
    monthData = [
      {
        date: this.lastSixMonths[0].month.toString(),
        customers: this.apiService.getOrdersFromMonth(this.lastSixMonths[0])
      },
      {
        date: this.lastSixMonths[1].month.toString(),
        customers: this.customers
      },
      {
        date: this.lastSixMonths[2].month.toString(),
        customers: this.customers
      },
      {
        date: this.lastSixMonths[3].month.toString(),
        customers: this.customers
      },
      {
        date: this.lastSixMonths[4].month.toString(),
        customers: this.customers
      },
      {
        date: this.lastSixMonths[5].month.toString(),
        customers: this.customers
      },
    ]*/

  displayedColumns: string[] = ['customer', 'count', 'sum', 'paid_status', 'paid_button'];
}
