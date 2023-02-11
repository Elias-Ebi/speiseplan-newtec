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
//  eqivalentMap = new Map<OrdersMonthByUser, OrderMonth>();
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
    /*
    const allOrders = [];
    for (let i = 0; i < 6; i++) {
      allOrders[i] = await this.apiService.getOrdersFromMonth(this.lastSixMonths[i]);
    }
*/
    for (const month of this.lastSixMonths) {
      // @ts-ignore
      this.dataMap.set(month, await this.apiService.getOrdersFromMonth(month));
    }
    /*
    allOrders.forEach((month, outerIndex) => {
      //one Order-month-entity per user
      //list with the datatype used for the representation
      let currentMonthRep: OrdersMonthByUser[] = [];
      month.forEach((user) => {

        let temp: OrdersMonthByUser = {
          name: user.profile.name,
          numberOfMeals: user.orders.length,
          totalBill: user.total,
          isPaid: user.paid
        };
        currentMonthRep.push(temp);
        this.eqivalentMap.set(temp, user);
      });
      // @ts-ignore
      this.dataMap.set(this.lastSixMonths[outerIndex], month);
    }); */
  }

  async changePaymentStatus(who: OrderMonth, what: boolean): Promise<OrderMonth> {

    console.log('was: '+ who.paid);
    who.paid = what;
    console.log('is: '+ who.paid);
    console.log('shall: '+what);
    // @ts-ignore
    let temp: Promise<OrderMonth> = await this.apiService.updatePaymentStatus(who);
   // this.loadMonthoverview();// todo works only oneway??
    return temp;
  }

  displayedColumns: string[] = ['customer', 'count', 'sum', 'paid_status', 'paid_button'];
}
