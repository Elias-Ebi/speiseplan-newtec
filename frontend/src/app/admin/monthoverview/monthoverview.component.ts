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
import {DateService} from "../../shared/services/date.service";
import PlainDate = Temporal.PlainDate;
import {OrdersMonthByUser} from "../../user/order/models/orders-month-by-user";

@Component({
  selector: 'app-monthoverview',
  standalone: true,
  imports: [CommonModule, MatIconModule, EuroPipe, WeekdayNamePipe, MatTabsModule, MonthNamePipe, MatButtonModule, MatInputModule, FormsModule, MatTableModule],
  templateUrl: './monthoverview.component.html',
  styleUrls: ['./monthoverview.component.scss']
})
export class MonthoverviewComponent implements OnInit {

  dataMap = new Map<PlainDate, [OrdersMonthByUser]>();
  lastSixMonths = this.dateService.getLastSixMonths();

  constructor(
    private apiService: ApiService,
    private dateService: DateService
  ) {
  }

  async ngOnInit(): Promise<void>{
    await this.loadMonthoverview();
  }

  private async loadMonthoverview(): Promise<void> {
    this.lastSixMonths = this.dateService.getLastSixMonths();
    const allOrders = [];
    for(let i = 0; i < 6; i++){
      allOrders[i] = await this.apiService.getOrdersFromMonth(this.lastSixMonths[i]);
    }

    allOrders.forEach((month, outerIndex)=> {
      //one Order-month-entity per user
      //list with the datatype used for the representation
      let currentMonthRep: OrdersMonthByUser[] = [];
      month.forEach((user) => {
        currentMonthRep.push({name: user.profile.name, numberOfMeals: user.orders.length, totalBill: user.total, isPaid: user.paid})
       });
      // @ts-ignore
      this.dataMap.set(this.lastSixMonths[outerIndex], currentMonthRep);
    });
  }

  displayedColumns: string[] = ['customer', 'count', 'sum', 'paid_status', 'paid_button'];
}
