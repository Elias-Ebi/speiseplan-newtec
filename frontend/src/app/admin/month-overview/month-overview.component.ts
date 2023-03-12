import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { EuroPipe } from "../../shared/pipes/euro.pipe";
import { Temporal } from "@js-temporal/polyfill";
import { WeekdayNamePipe } from "../../shared/pipes/weekday-name.pipe";
import { MonthNamePipe } from "../../shared/pipes/month-name.pipe";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { ApiService } from "../../shared/services/api.service";
import { DateService } from "../../shared/services/date.service";
import { OrderMonth } from "../../shared/models/order-month";
import { MatTabsModule } from "@angular/material/tabs";
import PlainDate = Temporal.PlainDate;

@Component({
  selector: 'app-month-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, EuroPipe, WeekdayNamePipe, MonthNamePipe, MatButtonModule, MatInputModule, FormsModule, MatTableModule, MatTabsModule],
  templateUrl: './month-overview.component.html',
  styleUrls: ['./month-overview.component.scss']
})
export class MonthOverviewComponent implements OnInit {

  dataMap = new Map<PlainDate, OrderMonth[]>();
  lastSixMonths = this.dateService.getLastSixMonths();
  searchTerm: string = "";
  dataSource: OrderMonth[] = [];

  constructor(
    private apiService: ApiService,
    private dateService: DateService
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadMonthoverview();
    this.setDataSource(0);
  }

  setDataSource(index: number) {
    this.dataSource = this.dataMap.get(this.lastSixMonths[index]) || [];
  }

  async setPaymentStatus(oderMonth: OrderMonth) {
    const updatedOrderMonth = await this.apiService.changePaymentStatus(oderMonth.id);
    oderMonth.paid = updatedOrderMonth.paid;
  }

  async search(month: PlainDate) {
    if (this.searchTerm != "") {
      this.dataSource = this.dataMap.get(month)?.filter(item => item.profile.name.toLowerCase().includes(this.searchTerm.toLowerCase())) || [];
    } else {
      this.dataSource = this.dataMap.get(month) || [];
    }
  }

  private async loadMonthoverview(): Promise<void> {
    this.lastSixMonths = this.dateService.getLastSixMonths();
    const requests = this.lastSixMonths.map(month =>
      this.apiService.getOderMonthsFrom(month)
    );
    const results = await Promise.all(requests);
    for (let i = 0; i < this.lastSixMonths.length; i++) {
      this.dataMap.set(this.lastSixMonths[i], results[i]);
    }
  }

  displayedColumns: string[] = ['customer', 'count', 'sum', 'paid_status', 'paid_button'];
}
