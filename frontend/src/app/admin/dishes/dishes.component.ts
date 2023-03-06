import { Component, OnInit } from '@angular/core';
import { Temporal } from '@js-temporal/polyfill';
import { MonthNamePipe } from '../../shared/pipes/month-name.pipe';
import { JsonPipe } from '@angular/common';
import { WeekdayNamePipe } from '../../shared/pipes/weekday-name.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DgChooseDishComponent } from '../components/dialogs/dishes-dialogs/dg-choose-dish/dg-choose-dish.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MealTemplate } from 'src/app/shared/models/mealtemplate';
import { ApiService } from 'src/app/shared/services/api.service';
import { Meal } from 'src/app/shared/models/meal';
import {
  CalendarWeek,
  CalendarWeekDay,
} from 'src/app/shared/models/calendar-week';
import { DgAddDishComponent } from '../components/dialogs/dishes-dialogs/dg-add-dish/dg-add-dish.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface Category {
  value: string;
  view: string;
}

@Component({
  selector: 'app-dishes',
  standalone: true,
  templateUrl: './dishes.component.html',
  imports: [
    MonthNamePipe,
    JsonPipe,
    WeekdayNamePipe,
    MatIconModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  styleUrls: ['./dishes.component.scss'],
})
export class DishesComponent implements OnInit {
  MAX_FOLLOWING_WEEKS = 2;

  displayedColumns: string[] = ['title', 'description', 'category'];
  dataSource: MatTableDataSource<Meal>;
  weekdayProperty: string;
  currentlyDisplayedWeek: CalendarWeek;
  currentTab: number = 0;
  calendarWeekIndex = 0;
  categories: Category[] = [
    { value: '44c615e8-80e4-40c9-b026-70f96cd21dcd', view: 'Fleisch' },
    { value: '6f8b2947-4784-4c61-b973-705b314ef4f6', view: 'Vegetarisch' },
    { value: 'af03df2a-0d22-4e7d-8a12-9269ecd318af', view: 'Vegan' },
    { value: '85d77591-0b55-4df4-93b0-03c00bcb14b9', view: 'Salat' },
  ];

  constructor(public dialog: MatDialog, private api: ApiService) {
    this.currentlyDisplayedWeek = this.getCalenderWeek(
      Temporal.Now.plainDateISO()
    );
    this.weekdayProperty = 'monday';
    this.dataSource = new MatTableDataSource();
  }

  async ngOnInit(): Promise<void> {
    await this.updateTableSource();
  }

  getCategoryView(val: string): string | any {
    let result: string = '';

    this.categories.forEach((c) => {
      if (c.value === val) {
        result = c.view;
      }
    });
    return result;
  }

  getCategoryValue(view: string): string | any {
    let result: string = '';

    this.categories.forEach((c) => {
      if (c.view === view) {
        result = c.value;
      }
    });
    return result;
  }

  onClickChooseDish(selectedMealTemplate?: MealTemplate) {
    this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
    let currentDay =
      this.currentlyDisplayedWeek[this.weekdayProperty].date.toString();

    const dialogRef = this.dialog.open(DgAddDishComponent, {
      data: { weekday: this.weekdayProperty, deliveryDate: new Date(currentDay), selectedMealTemplate },
      width: '40%',
      height: '80%',
      autoFocus: false,
    });

    dialogRef
      .afterClosed()
      .subscribe(async (mealData: { mealToAdd: any; useTemplate: boolean }) => {
        if (JSON.stringify(mealData) !== '{}') {
          if (mealData.useTemplate) {
            const dialogRef = this.dialog.open(DgChooseDishComponent, {
              data: {},
              width: '70%',
              height: '80%',
              autoFocus: false,
            });

            dialogRef
              .afterClosed()
              .subscribe(async (selectedMealTemplate: any) => {
                if (JSON.stringify(selectedMealTemplate) !== '{}') {
                  this.onClickChooseDish(selectedMealTemplate);
                }
              });
          } else {
            this.currentlyDisplayedWeek[this.weekdayProperty].dishes.push(
              mealData.mealToAdd
            );
            await this.api.addMeal(mealData.mealToAdd);
            await this.updateTableSource();
          }
        }
      });
  }

  async onTabChange(event: any) {
    let index: number = Number.parseInt(event.index);
    this.currentTab = index;
    this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
    await this.updateTableSource();
  }

  async getNextCalendarWeek() {
    if (this.calendarWeekIndex < this.MAX_FOLLOWING_WEEKS) {
      let followingWeekDate = this.currentlyDisplayedWeek.friday.date.add({
        days: 7,
      });
      this.currentlyDisplayedWeek = this.getCalenderWeek(followingWeekDate);
      this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
      await this.updateTableSource();
      this.calendarWeekIndex++;
    }
  }

  async getPreviousCalendarWeek() {
    if (this.calendarWeekIndex > 0) {
      let precedingWeekDate = this.currentlyDisplayedWeek.friday.date.subtract({
        days: 7,
      });
      this.currentlyDisplayedWeek = this.getCalenderWeek(precedingWeekDate);
      this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
      await this.updateTableSource();
      this.calendarWeekIndex--;
    }
  }

  getCalenderWeek(date: Temporal.PlainDate): CalendarWeek {
    return new CalendarWeek(date);
  }

  getWeekdayPropertyFromIndex(index: number): string {
    //TODO:handle else case better
    if (index == 0) {
      return 'monday';
    } else if (index == 1) {
      return 'tuesday';
    } else if (index == 2) {
      return 'wednesday';
    } else if (index == 3) {
      return 'thursday';
    } else {
      return 'friday';
    }
  }

  async updateTableSource() {
    const mealsOnDate = await this.api.getMealsOn(
      this.currentlyDisplayedWeek[this.weekdayProperty].date
    );
    this.dataSource = new MatTableDataSource(mealsOnDate);
  }
}
