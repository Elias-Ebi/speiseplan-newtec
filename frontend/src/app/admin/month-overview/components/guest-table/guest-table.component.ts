import {Component, Input, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import {MonthOverviewMonth} from "../../month-overview.models";
import {MatTableDataSource, MatTableModule} from "@angular/material/table";
import {EuroPipe} from "../../../../shared/pipes/euro.pipe";
import {ApiService} from "../../../../shared/services/api.service";
import {OrderMonth} from "../../../../shared/models/order-month";
import {Order} from "../../../../shared/models/order";
import {forEach} from "lodash";


interface GuestOrders{
  guestName: string;
  orderer: string[];
  days: string[];
  total: number;
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

  displayedGuestTableColumns = ['guest', 'user', 'sum'];
  //@ts-ignore
  datasource: MatTableDataSource<GuestOrders>;
constructor(private apiService: ApiService) {
}

  async ngOnInit(): Promise<void> {
    await this.generateGuestData();
  }


  private async generateGuestData(){
    let ordersWithGuests = await this.apiService.getGuestMonthOverview();
    ordersWithGuests = ordersWithGuests.filter((order) => order.date.startsWith(this._month.yearMonth.toString()));
    let guestOrders: GuestOrders[]= [];
    ordersWithGuests.forEach(order => {
      const existingGuestOrder = guestOrders.find(guestOrder =>
        guestOrder.guestName === order.guestName //&& guestOrder.orderer === order.profile.name
      );

      if (existingGuestOrder) {
        existingGuestOrder.days.push(order.date);
        existingGuestOrder.total += order.meal.total;
        existingGuestOrder.orderer.push(order.profile.name);
        //remove duplicate orderers
        existingGuestOrder.orderer = Array.from(new Set(existingGuestOrder.orderer));
      } else {
        const newGuestOrder: GuestOrders = {
          guestName: order.guestName,
          orderer: [order.profile.name],
          days: [order.date],
          total: order.meal.total
        };
        guestOrders.push(newGuestOrder);
      }
    });

    this.datasource = new MatTableDataSource<GuestOrders>(guestOrders);
  }
}
