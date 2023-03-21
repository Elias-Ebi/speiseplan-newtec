import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {EuroPipe} from "../../shared/pipes/euro.pipe";
import {WeekdayNamePipe} from "../../shared/pipes/weekday-name.pipe";
import {MatTabsModule} from "@angular/material/tabs";
import {Temporal} from "@js-temporal/polyfill";
import {MatButtonModule} from "@angular/material/button";
import {MatExpansionModule} from "@angular/material/expansion";
import {Order} from 'src/app/shared/models/order';
import {DateService} from "../../shared/services/date.service";
import {ApiService} from "../../shared/services/api.service";
import {Profile} from "../../shared/models/profile";
import PlainDate = Temporal.PlainDate;
import {MatDialog} from "@angular/material/dialog";
import {OverviewInformDialogComponent} from "./overview-inform-dialog/overview-inform-dialog.component";
import {MatTreeModule} from "@angular/material/tree";
import {MatListModule} from "@angular/material/list";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTabsModule, EuroPipe, WeekdayNamePipe, MatButtonModule, MatExpansionModule, MatTreeModule, MatListModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  dataMap = new Map<PlainDate, Order[][]>();
  weekdays = this.dateService.getNextFiveWeekDays();


  constructor(
    public dialog: MatDialog,
    private apiService: ApiService,
    private dateService: DateService) {
  }

  async ngOnInit(): Promise<void> {
    this.weekdays = this.dateService.getNextFiveWeekDays();
    await this.loadWeek();
  }

  async loadWeek(): Promise<void> {
    const week = new Map<PlainDate, Order[]>();
    const requests = this.weekdays.map(day => this.apiService.getAllOrdersOnDate(day));
    const results = await Promise.all(requests);
    for (let i = 0; i < this.weekdays.length; i++) {
      week.set(this.weekdays[i], results[i]);
    }

    for (const day of this.weekdays) {
      const temp = week.get(day)!.reduce((acc, item) => {
        const group = item.meal.name;
        acc[group] = acc[group] || [];
        acc[group].push(item);
        return acc;
      }, {} as { [key: string]: any[] });
      // is type [[order]], the orders inside the inner arrays have the same corresponding meal.name
      let mealgroups: Order[][] = Object.values(temp);
      this.dataMap.set(day, mealgroups);
    }
  }

  onClickInform(event: MouseEvent, mealOrders: Order[]) {
    //to prevent button-click expanding the expansion panel
    event.stopPropagation();
    const dialogRef = this.dialog.open(OverviewInformDialogComponent, {
      data: {
        meals: mealOrders
      }
    });

    dialogRef.afterClosed().subscribe(async (data: { sendMessage: boolean, selectedUsers: Order[] }) => {
      if (data.sendMessage) {
        try {
          const filteredOrders: string[] = data.selectedUsers.map((order: Order) => order.id);
          const ordersCanceled = await this.apiService.deleteMultipleOrdersByIdAndInform(filteredOrders);
          await this.loadWeek();
        } catch (error) {
        }
      }
    });

  }

}
