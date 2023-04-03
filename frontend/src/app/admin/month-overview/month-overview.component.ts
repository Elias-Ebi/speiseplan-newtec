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
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {ApiService} from "../../shared/services/api.service";
import {OrderMonth} from "../../shared/models/order-month";
import {MatTabsModule} from "@angular/material/tabs";
import {MonthOverviewMonth, MonthOverviewOrderMonth} from "./month-overview.models";
import {groupBy, sortByYearMonth} from "../../user/shared/utils";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import PlainYearMonth = Temporal.PlainYearMonth;
import {GuestTableComponent} from "./components/guest-table/guest-table.component";
import {Order} from "../../shared/models/order";

@Component({
  selector: 'app-month-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, EuroPipe, WeekdayNamePipe, MonthNamePipe, MatButtonModule, MatInputModule, FormsModule, MatTableModule, MatTabsModule, MatButtonToggleModule, GuestTableComponent],
  templateUrl: './month-overview.component.html',
  styleUrls: ['./month-overview.component.scss']
})
export class MonthOverviewComponent implements OnInit {
  months: MonthOverviewMonth[] = [];
  displayedColumns = ['customer', 'count', 'sum', 'paid_status', 'paid_button'];
  guestMode = false;
  private dataMap = new Map<string, MonthOverviewOrderMonth[]>();

  constructor(private apiService: ApiService) {
  }

  get Headline() {
    return this.guestMode ? 'Gäste' : 'Mitarbeiter';
  }

  async ngOnInit(): Promise<void> {
    await this.generateEmployeeData();
  }

  async setPaymentStatus(oderMonth: OrderMonth) {
    const updatedOrderMonth = await this.apiService.changePaymentStatus(oderMonth.id);
    oderMonth.paid = updatedOrderMonth.paid;
  }

  search(month: MonthOverviewMonth) {
    month.dataSource.filterPredicate = (data: OrderMonth, filter: string) => {
      const name = data.profile.name.toLowerCase();
      const nameFilter = filter.trim().toLowerCase();
      return name.indexOf(nameFilter) != -1;
    }

    month.dataSource.filter = month.searchTerm;
  }

  resetSearchTerm(month: MonthOverviewMonth) {
    month.searchTerm = '';
    this.search(month);
  }

  countWithoutGuestOrders(orders: Order[]){
    const filteredOrders = orders.filter((order) => order.guestName === null);
    return filteredOrders.length;
  }

  private async generateEmployeeData() {
    const orderMonths = await this.apiService.getMonthOverview();
    const transformedOrderMonths: MonthOverviewOrderMonth[] = orderMonths.map((orderMonth) => {
      return {
        ...orderMonth,
        yearMonth: PlainYearMonth.from({year: orderMonth.year, month: orderMonth.month}).toString(),
      }
    })

    this.dataMap = groupBy(transformedOrderMonths, 'yearMonth');
    this.months = this.generateMonthsArray();
    this.displayedColumns = ['customer', 'count', 'sum', 'paid_status', 'paid_button'];
  }

  private generateMonthsArray(): MonthOverviewMonth[] {
    const months: MonthOverviewMonth[] = Array.from(this.dataMap.entries()).map(([yearMonth, orderMonths]) => {
      return {
        yearMonth: PlainYearMonth.from(yearMonth),
        orderMonths,
        dataSource: new MatTableDataSource<OrderMonth>(orderMonths),
        searchTerm: ''
      }
    })

    return months.sort((a, b) => sortByYearMonth(a.yearMonth, b.yearMonth)).reverse();
  }

  async sendPaymentReminder(month: MonthOverviewMonth) {
    let notPaidOrderMonthOverviewMonth: MonthOverviewOrderMonth[] = [];
    month.orderMonths.forEach(monthOrders => {
      if (!monthOrders.paid) {
        notPaidOrderMonthOverviewMonth.push(monthOrders);
      }
    });
    await this.apiService.sendPaymentReminders(notPaidOrderMonthOverviewMonth);
  }
}
