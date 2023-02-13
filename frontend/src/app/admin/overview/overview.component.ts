import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {EuroPipe} from "../../shared/pipes/euro.pipe";
import {WeekdayNamePipe} from "../../shared/pipes/weekday-name.pipe";
import {MatTabsModule} from "@angular/material/tabs";
import {Temporal} from "@js-temporal/polyfill";
import {MatButtonModule} from "@angular/material/button";
import {MatExpansionModule} from "@angular/material/expansion";
import PlainDate = Temporal.PlainDate;
import {Order} from 'src/app/shared/models/order';
import {DateService} from "../../shared/services/date.service";
import {ApiService} from "../../shared/services/api.service";
import {DayoverviewRep} from "./models/dayoverview-rep";
import {Mealoverview} from "./models/mealoverview";
import {Profile} from "../../shared/models/profile";
import {Meal} from "../../shared/models/meal";
import {saveAs} from "file-saver";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTabsModule, EuroPipe, WeekdayNamePipe, MatButtonModule, MatExpansionModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  dataMap = new Map<PlainDate, [Mealoverview]>();
  weekdays = this.dateService.getNextFiveWeekDays();

  constructor(
    private apiService: ApiService,
    private dateService: DateService) {
  }

  async ngOnInit(): Promise<void> {
    await this.loadWeek();
  }

  async loadWeek(): Promise<void> {
    this.weekdays = this.dateService.getNextFiveWeekDays();

    for (const day of this.weekdays) {
      let dayOrders: Order[] = await this.apiService.getAllOrdersOnDate(day);
      //slight variation of the groupBy function in utils for meals
      const temp = dayOrders.reduce((acc, item) => {
        const group = item.meal.name;
        acc[group] = acc[group] || [];
        acc[group].push(item);
        return acc;
      }, {} as { [key: string]: any[] });
      // is type [[order]], the orders inside the inner arrays have the same corresponding meal.name
      let mealgroups = Object.values(temp);

      let data: Mealoverview[] = [];
      // @ts-ignore
      mealgroups.forEach((sameMealOrders: [Order]) => {
        // @ts-ignore
        let users: [Profile] = [];
        let aMeal: Meal;
        sameMealOrders.forEach((order: Order) => {
          users.push(order.profile);
          aMeal = order.meal;
        });
        // @ts-ignore
        data.push({meal: aMeal, total: sameMealOrders.length, users: users});
      });
      // @ts-ignore
      this.dataMap.set(day, data);
    }
  }

  downloadDayAsCsv(day: PlainDate) {
    const dayData = this.dataMap.get(day);

    let data: DayoverviewRep[] = [];
    // @ts-ignore
    dayData.forEach((meals) => {
        // @ts-ignore
      meals.users.forEach((usr) => {
        data.push({Gericht: meals.meal.name, Name: usr.name});
      })

    });
    const replacer = (key: any, value: null) => (value === null ? '' : value);

    const header = Object.keys(data[0]);
    const csv = data.map((row) =>
      header.map((fieldName) => JSON.stringify(row[fieldName as keyof DayoverviewRep], replacer)).join(',')
    );
    csv.unshift(header.join(','));
    const csvArray = csv.join('\r\n');

    const blob = new Blob([csvArray], {type: 'text/csv'});
    saveAs(blob, 'Bestellungen_' + day.toString() + '.csv');
  }

}
