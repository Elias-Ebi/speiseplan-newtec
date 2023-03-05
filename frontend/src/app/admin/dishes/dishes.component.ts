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
import { CalendarWeek, CalendarWeekDay } from 'src/app/shared/models/calendar-week';
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
    this.currentlyDisplayedWeek = this.getCalenderWeek(Temporal.Now.plainDateISO());
    this.dataSource = new MatTableDataSource();
    this.weekdayProperty = 'monday';
  }

  ngOnInit(): void {
    //this.dishes = await this.api.getOrderableMeals();
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

  onClickChooseDish() {
    this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
    let currentDay = this.currentlyDisplayedWeek[this.weekdayProperty].date.toString();

    const dialogRef = this.dialog.open(DgAddDishComponent, {
      data: {deliveryDate: new Date(currentDay)},
      width: '60%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe(async (mealToAdd: Meal) => {
      if(JSON.stringify(mealToAdd) !== '{}') {
        // categoryId, name, description, id => Meal
        // Gesucht: date, delivery, orderable, total, ordercount
        const date: string = "" //this.currentMondayDate;
        const delivery: string = "" //this.currentMondayDate+'T12:00:00';
        const orderable: string = "" //this.year+'-'+this.month+'-'+(this.firstDayOfWeek-3)+'T13:00:00';
        const total: number = 3.6;
        const ordercount: number = 0;
        const meal: any = {
          date: date, delivery: delivery,
          orderable: orderable, total: total,
          orderCount: ordercount,
          categoryId: mealToAdd.categoryId,
          description: mealToAdd.description,
          name: mealToAdd.name};
        this.currentlyDisplayedWeek[this.weekdayProperty].dishes.push(meal);
        this.dataSource = new MatTableDataSource(this.currentlyDisplayedWeek[this.weekdayProperty].dishes);
      }
    });
  }

  onTabChange(event: any) {
    let index: number = Number.parseInt(event.index);
    this.currentTab = index;
    this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
    this.dataSource = new MatTableDataSource(this.currentlyDisplayedWeek[this.weekdayProperty].dishes);
  }

  getNextCalendarWeek() {
    if(this.calendarWeekIndex < this.MAX_FOLLOWING_WEEKS) {
      let followingWeekDate = this.currentlyDisplayedWeek.friday.date.add({days: 7});
      this.currentlyDisplayedWeek = this.getCalenderWeek(followingWeekDate);
      this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
      this.dataSource = new MatTableDataSource(this.currentlyDisplayedWeek[this.weekdayProperty].dishes);
      this.calendarWeekIndex++;
    }
  }

  getPreviousCalendarWeek() {
    if(this.calendarWeekIndex > 0) {
      let precedingWeekDate = this.currentlyDisplayedWeek.friday.date.subtract({days: 7});
      this.currentlyDisplayedWeek = this.getCalenderWeek(precedingWeekDate);
      this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
      this.dataSource = new MatTableDataSource(this.currentlyDisplayedWeek[this.weekdayProperty].dishes);
      this.calendarWeekIndex--;
    }
  }

  getCalenderWeek(date: Temporal.PlainDate): CalendarWeek {
    return new CalendarWeek(date)
  }

  getWeekdayPropertyFromIndex(index: number): string {
    //TODO:handle else case better
    if(index == 0) {
      return 'monday';
    } else if(index == 1) {
      return 'tuesday';
    } else if(index == 2) {
      return 'wednesday';
    } else if(index == 3) {
      return 'thursday';
    } else {
      return 'friday';
    }
  }
}
