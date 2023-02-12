import { Component } from '@angular/core';
import { Temporal } from '@js-temporal/polyfill';
import { MonthNamePipe } from '../../shared/pipes/month-name.pipe';
import { JsonPipe } from '@angular/common';
import { WeekdayNamePipe } from '../../shared/pipes/weekday-name.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DgChooseDishComponent } from '../components/dialogs/dishes-dialogs/dg-choose-dish/dg-choose-dish.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MealTemplate } from 'src/app/shared/models/mealtemplate';

const DISHES: MealTemplate[] = [];

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
export class DishesComponent {
  constructor(public dialog: MatDialog) {}
  date = Temporal.Now.plainDateISO();
  weekOfYear = this.date.calendar.weekOfYear(this.date);
  firstDayOfWeek = this.date.toPlainMonthDay().day - (this.date.dayOfWeek - 1);
  fifthDayOfWeek = this.date.toPlainMonthDay().day - (this.date.dayOfWeek - 5);
  month = this.date.month;
  year = this.date.year;

  displayedColumns: string[] = ['title', 'description', 'category'];
  dataSource = DISHES;

  onClickChooseDish() {
    const dialogRef = this.dialog.open(DgChooseDishComponent, {
      data: {},
      width: '60%',
      height: '80%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  getDateString(): string {
    return `KW ${this.weekOfYear} — ${this.firstDayOfWeek}.${this.month}.${this.year} - ${this.fifthDayOfWeek}.${this.month}.${this.year}`;
  }
}
