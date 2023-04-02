import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MonthOverviewMonth} from "../../month-overview.models";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {EuroPipe} from "../../../../shared/pipes/euro.pipe";
import {ApiService} from "../../../../shared/services/api.service";
import {OrderMonth} from "../../../../shared/models/order-month";
import {Order} from "../../../../shared/models/order";


interface OrdersByMonth {
  [yearMonth: string]: Order[];
}

@Component({
  selector: 'app-guest-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, EuroPipe],
  templateUrl: './guest-table.component.html',
  styleUrls: ['./guest-table.component.scss']
})
export class GuestTableComponent implements OnInit{
  @Input()
  get month(): MonthOverviewMonth { return this._month;}
  set month(month: MonthOverviewMonth){
    this._month = month;
  }

  //@ts-ignore
  public _month: MonthOverviewMonth;

  displayedGuestTableColumns = ['guest', 'user', 'sum', 'day'];
  //@ts-ignore
  datasource: MatTableDataSource<Order>;
constructor(private apiService: ApiService) {
}

  async ngOnInit(): Promise<void> {
    await this.generateGuestData();
  }


  private async generateGuestData(){
    let ordersWithGuests = await this.apiService.getGuestMonthOverview();
    console.log(ordersWithGuests)
    console.log(ordersWithGuests);
    ordersWithGuests = ordersWithGuests.filter((order) => order.date.startsWith(this._month.yearMonth.toString()));
    console.log(ordersWithGuests)
    this.datasource = new MatTableDataSource<Order>(ordersWithGuests);
  }
}
