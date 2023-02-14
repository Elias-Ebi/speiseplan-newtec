import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {EuroPipe} from "../../shared/pipes/euro.pipe";
import {Temporal} from "@js-temporal/polyfill";
import {WeekdayNamePipe} from "../../shared/pipes/weekday-name.pipe";
import {MonthNamePipe} from "../../shared/pipes/month-name.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {ApiService} from "../../shared/services/api.service";
import {DateService} from "../../shared/services/date.service";
import PlainDate = Temporal.PlainDate;
import {OrderMonth} from "../../shared/models/order-month";

@Component({
  selector: 'app-monthoverview',
  standalone: true,
  imports: [CommonModule, MatIconModule, EuroPipe, WeekdayNamePipe, MonthNamePipe, MatButtonModule, MatInputModule, FormsModule, MatTableModule],
  templateUrl: './monthoverview.component.html',
  styleUrls: ['./monthoverview.component.scss']
})
export class MonthoverviewComponent implements OnInit {

  dataMap = new Map<PlainDate, [OrderMonth]>();
  lastSixMonths = this.dateService.getLastSixMonths();
  searchTerm: string = "";

  constructor(
    private apiService: ApiService,
    private dateService: DateService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadMonthoverview();
  }

  private async loadMonthoverview(): Promise<void> {
    this.lastSixMonths = this.dateService.getLastSixMonths();
    const requests = this.lastSixMonths.map(month =>
      // @ts-ignore
      this.apiService.getOrderMonthFromMonth(month)
    );
    const results = await Promise.all(requests);
    for (let i = 0; i < this.lastSixMonths.length; i++) {
      // @ts-ignore
      this.dataMap.set(this.lastSixMonths[i], results[i]);
    }
  }

  async changePaymentStatus(user: OrderMonth, month: PlainDate): Promise<OrderMonth> {
    const updatedOrderMonth = await this.apiService.updatePaymentStatus(user);
    // @ts-ignore
    this.dataMap.set(month, await this.apiService.getOrderMonthFromMonth(month));
    return updatedOrderMonth;
  }

  async search(month: PlainDate) {
    if (this.searchTerm != "") {
      let filteredOrders = await this.apiService.getOrderMonthFromMonth(month);
      filteredOrders = filteredOrders.filter(item => item.profile.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      // @ts-ignore
      this.dataMap.set(month, filteredOrders);
    } else {
      let filteredOrders = await this.apiService.getOrderMonthFromMonth(month);
      // @ts-ignore
      this.dataMap.set(month, filteredOrders);
    }
  }

  displayedColumns: string[] = ['customer', 'count', 'sum', 'paid_status', 'paid_button'];
}
