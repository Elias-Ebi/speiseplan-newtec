import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {EuroPipe} from "../../shared/pipes/euro.pipe";
import {Temporal} from "@js-temporal/polyfill";
import {WeekdayNamePipe} from "../../shared/pipes/weekday-name.pipe";
import {MatTabsModule} from "@angular/material/tabs";
import {MonthNamePipe} from "../../shared/pipes/month-name.pipe";
import {MonthYearNamePipe} from "../../shared/pipes/month-year-name.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatTableModule} from "@angular/material/table";
import {ApiService} from "../../shared/services/api.service";
import {DateService} from "../../shared/services/date.service";
import PlainDate = Temporal.PlainDate;
import {OrderMonth} from "../../shared/models/orderMonth";
import {saveAs} from "file-saver";
import {OrdersMonthRep} from "./models/order-month-rep";

@Component({
  selector: 'app-monthoverview',
  standalone: true,
  imports: [CommonModule, MatIconModule, EuroPipe, MonthYearNamePipe, WeekdayNamePipe, MatTabsModule, MonthNamePipe, MatButtonModule, MatInputModule, FormsModule, MatTableModule],
  templateUrl: './monthoverview.component.html',
  styleUrls: ['./monthoverview.component.scss']
})
export class MonthoverviewComponent implements OnInit {

  //todo: Suche, Zahlungserinnerung, Export (csv, pdf)
  dataMap = new Map<PlainDate, [OrderMonth]>();
  lastSixMonths = this.dateService.getLastSixMonths();

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
    for (const month of this.lastSixMonths) {
      // @ts-ignore
      this.dataMap.set(month, await this.apiService.getOrdersFromMonth(month));
    }
  }

  async changePaymentStatus(user: OrderMonth, paymentStatus: boolean): Promise<OrderMonth> {
    user.paid = paymentStatus;
    // @ts-ignore
    return await this.apiService.updatePaymentStatus(user);
  }

  downloadMonthAsCsv(month: PlainDate) {
    const monthData = this.dataMap.get(month);
    let data: OrdersMonthRep[] = [];
    // @ts-ignore
    monthData.forEach((user) => {
      data.push({Besteller: user.profile.name, Anzahl: user.orders.length, Betrag: user.total, Bezahlstatus: user.paid});
    });
    const replacer = (key: any, value: null) => (value === null ? '' : value);
    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header.map((fieldName) => JSON.stringify(row[fieldName as keyof OrdersMonthRep], replacer)).join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const a = document.createElement('a');
    const blob = new Blob([csvArray], {type: 'text/csv'});
    const url = window.URL.createObjectURL(blob);

    a.href = url;
    a.download = 'Bestellungen_' + month.toLocaleString('default', {month: 'long'}) +'_' +month.year.toString()+ '.csv';
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();

  }

  displayedColumns: string[] = ['customer', 'count', 'sum', 'paid_status', 'paid_button'];
}
