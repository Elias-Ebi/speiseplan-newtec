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
  ],
  styleUrls: ['./dishes.component.scss'],
})
export class DishesComponent implements OnInit {
  displayedColumns: string[] = ['title', 'description', 'category'];
  dishes: Meal[];
  dataSource: MatTableDataSource<Meal>;

  categories: Category[] = [
    { value: '44c615e8-80e4-40c9-b026-70f96cd21dcd', view: 'Fleisch' },
    { value: '6f8b2947-4784-4c61-b973-705b314ef4f6', view: 'Vegetarisch' },
    { value: 'af03df2a-0d22-4e7d-8a12-9269ecd318af', view: 'Vegan' },
    { value: '85d77591-0b55-4df4-93b0-03c00bcb14b9', view: 'Salat' },
  ];

  constructor(public dialog: MatDialog, private api: ApiService) {
    this.dishes = [];
    this.dataSource = new MatTableDataSource();
  }

  async ngOnInit(): Promise<void> {
    this.dishes = await this.api.getOrderableMeals();
  }

  currentTab: number = 0;

  date = Temporal.Now.plainDateISO();
  weekOfYear = this.date.calendar.weekOfYear(this.date);
  firstDayOfWeek = this.date.toPlainMonthDay().day - (this.date.dayOfWeek - 1);
  fifthDayOfWeek = this.date.toPlainMonthDay().day - (this.date.dayOfWeek - 5);
  month = this.date.month;
  year = this.date.year;

  currentMonday: string =
    this.firstDayOfWeek.toString().length === 1
      ? '0' + this.firstDayOfWeek
      : '' + this.firstDayOfWeek;
  currentTuesday: string =
    (this.firstDayOfWeek + 1).toString().length === 1
      ? '0' + (this.firstDayOfWeek + 1)
      : '' + (this.firstDayOfWeek + 1);
  currentWednesday: string =
    (this.firstDayOfWeek + 2).toString().length === 1
      ? '0' + (this.firstDayOfWeek + 2)
      : '' + (this.firstDayOfWeek + 2);
  currentThursday: string =
    (this.firstDayOfWeek + 3).toString().length === 1
      ? '0' + (this.firstDayOfWeek + 3)
      : '' + (this.firstDayOfWeek + 3);
  currentFriday: string =
    (this.firstDayOfWeek + 4).toString().length === 1
      ? '0' + (this.firstDayOfWeek + 4)
      : '' + (this.firstDayOfWeek + 4);

  currentMondayDate: string = this.year + '-' + (this.month.toString().length === 1 ? '0' + this.month : '' + this.month) + '-' + this.currentMonday;
  currentTuesdayDate: string = this.year + '-' + (this.month.toString().length === 1 ? '0' + this.month : '' + this.month) + '-' + this.currentTuesday;
  currentWednesdayDate: string = this.year + '-' + (this.month.toString().length === 1 ? '0' + this.month : '' + this.month) + '-' + this.currentWednesday;
  currentThursdayDate: string = this.year + '-' + (this.month.toString().length === 1 ? '0' + this.month : '' + this.month) + '-' + this.currentThursday;
  currentFridayDate: string = this.year + '-' + (this.month.toString().length === 1 ? '0' + this.month : '' + this.month) + '-' + this.currentFriday;

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
    const dialogRef = this.dialog.open(DgChooseDishComponent, {
      data: {},
      width: '60%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe(async (result: MealTemplate) => {
      // categoryId, name, description, id => Meal
      // Gesucht: date, delivery, orderable, total, ordercount
      switch(this.currentTab) {
        case 0 /* Montag */ :
          const date: string = this.currentMondayDate;
          const delivery: string = this.currentMondayDate+'T12:00:00';
          const orderable: string = this.year+'-'+this.month+'-'+(this.firstDayOfWeek-3)+'T13:00:00';
          const total: number = 3.6;
          const ordercount: number = 0;

          const meal: any = {date: date, delivery: delivery, orderable: orderable, total: total, orderCount: ordercount, categoryId: result.categoryId, description: result.description, name: result.name};
          this.dishes.push(meal);
          this.dataSource = new MatTableDataSource(this.dishes);
          break;
        case 1 /* Dienstag */ :
          break;
        case 2 /* Mittwoch */ :
          break;
        case 3 /* Donnerstag */ :
          break;
        case 4 /* Freitag */ :
          break;
      }
    });
  }

  onTabChange(event: any) {
    let index: number = Number.parseInt(event.index);
    this.currentTab = index;
  }

  getDateString(): string {
    return `KW ${this.weekOfYear} — ${this.firstDayOfWeek}.${this.month}.${this.year} - ${this.fifthDayOfWeek}.${this.month}.${this.year}`;
  }
}
