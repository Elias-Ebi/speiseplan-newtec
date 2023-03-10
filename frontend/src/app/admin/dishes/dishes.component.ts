import { Component, OnInit, ViewChild } from '@angular/core';
import { Temporal } from '@js-temporal/polyfill';
import { MonthNamePipe } from '../../shared/pipes/month-name.pipe';
import { JsonPipe } from '@angular/common';
import { WeekdayNamePipe } from '../../shared/pipes/weekday-name.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule, MatTabGroup } from '@angular/material/tabs';
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
import { DgDeleteDishComponent } from '../components/dialogs/dishes-dialogs/dg-delete-dish/dg-delete-dish.component';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  @ViewChild('tabs', {static: false}) tabGroup!: MatTabGroup;

  MAX_FOLLOWING_WEEKS = 2;
  displayedColumns: string[] = ['title', 'description', 'category', 'action'];
  dataSource: MatTableDataSource<Meal>;
  weekdayProperty: string;
  currentlyDisplayedWeek: CalendarWeek = new CalendarWeek(
    Temporal.Now.plainDateISO()
  );
  currentTab: number = 0;
  calendarWeekIndex = 0;
  maxPossibleTabIndex = 0;
  categories: Category[] = [
    { value: '44c615e8-80e4-40c9-b026-70f96cd21dcd', view: 'Fleisch' },
    { value: '6f8b2947-4784-4c61-b973-705b314ef4f6', view: 'Vegetarisch' },
    { value: 'af03df2a-0d22-4e7d-8a12-9269ecd318af', view: 'Vegan' },
    { value: '85d77591-0b55-4df4-93b0-03c00bcb14b9', view: 'Salat' },
  ];

  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.weekdayProperty = 'monday';
    this.dataSource = new MatTableDataSource();
  }

  async ngOnInit(): Promise<void> {
    // if it is friday, saturday or sunday, the firstcalendar week needs to be
    // the following week, as changes to the current calendar week ar impossible
    let checkDate = new Date();
    if (
      checkDate.getDay() === 0 ||
      checkDate.getDay() === 5 ||
      checkDate.getDay() === 6
    ) {
      this.currentlyDisplayedWeek = await this.getCalenderWeek(
        Temporal.Now.plainDateISO().add({ days: 7 })
      );
    } else {
      this.currentlyDisplayedWeek = await this.getCalenderWeek(
        Temporal.Now.plainDateISO()
      );
    }

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
      data: {
        weekday: this.weekdayProperty,
        deliveryDate: new Date(currentDay),
        selectedMealTemplate,
      },
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

  onClickDeleteDish(element: any) {
    const dialogRef = this.dialog.open(DgDeleteDishComponent, {
      data: { name: element.name },
    });

    dialogRef
      .afterClosed()
      .subscribe(async (data: { isDeletingDishConfirmed: boolean }) => {
        if (data.isDeletingDishConfirmed) {
          try {
            await this.api.deleteMeal(element.id);
            await this.updateTableSource();
            this.snackBar.open('Gericht erfolgreich gelöscht!', 'OK', {
              duration: 3000,
              panelClass: 'success-snackbar',
            });
          } catch (error) {
            this.snackBar.open('Gericht konnte nicht gelöscht werden.', 'OK', {
              duration: 3000,
              panelClass: 'success-snackbar',
            });
          }
        }
      });
  }

  async onTabChange(event: any) {
    console.log('ON TAB CHANGE (before): ', this.currentTab)
    let eventIndex: number = Number.parseInt(event.index);
    this.currentTab = eventIndex;
    this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
    console.log('ON TAB CHANGE (after): ', this.currentTab)
    await this.updateTableSource();
  }

  async getNextCalendarWeek() {
    if (this.calendarWeekIndex < this.MAX_FOLLOWING_WEEKS) {
      let followingWeekDate = this.currentlyDisplayedWeek.friday.date.add({
        days: 7,
      });
      this.calendarWeekIndex++;
      this.currentlyDisplayedWeek = await this.getCalenderWeek(
        followingWeekDate
      );
      this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
      await this.updateTableSource();
    }
  }

  async getPreviousCalendarWeek() {
    if (this.calendarWeekIndex > 0) {
      let precedingWeekDate = this.currentlyDisplayedWeek.friday.date.subtract({
        days: 7,
      });
      this.calendarWeekIndex--;
      this.currentlyDisplayedWeek = await this.getCalenderWeek(
        precedingWeekDate
      );
      console.log('this tab will be opended: ', this.currentTab)
      this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
      await this.updateTableSource();
    }
  }

  async getCalenderWeek(date: Temporal.PlainDate): Promise<CalendarWeek> {
    await this.disableImpossibleTabs();
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

  async disableImpossibleTabs() {

    console.log('-------------disable impossible ----------- wewekindex: ' , this.calendarWeekIndex);
    if (this.calendarWeekIndex === 0) {
      let currentDate = Temporal.Now.plainDateISO();
      /*
      compare(one, two)
        −1 if one comes before two (this can never be the case here)
        0 if one and two are the same date when projected into the ISO 8601 calendar
        1 if one comes after two
      */
      const isMondayInThePast = Temporal.PlainDate.compare(
        currentDate,
        this.currentlyDisplayedWeek.monday.date
      );
      // to consider: sunday == 0, mondaytab = 0
      const currentIndex = this.parseToTabIndex(new Date().getDay());
      if (currentIndex < 4) {
        this.currentTab = currentIndex + 1;
      }
      // dates are the same, it is the current monday. disable monday, as it is not possible to make a new dish here
      if (isMondayInThePast === 0) {
        this.weekdayProperty = this.getWeekdayPropertyFromIndex(
          this.currentTab
        );

        this.maxPossibleTabIndex = this.currentTab;
        console.log('maxpossible tab: ', this.maxPossibleTabIndex);
        this.getNextEnabledTab();
        await this.updateTableSource();
        // the monday is in the past, disable every tab before the current tab
      } else if (isMondayInThePast === 1) {
        this.weekdayProperty = this.getWeekdayPropertyFromIndex(
          this.currentTab
        );

        this.maxPossibleTabIndex = this.currentTab;
        console.log('maxpossible tab: ', this.maxPossibleTabIndex);
        this.getNextEnabledTab();
        await this.updateTableSource();
      }
    } else {
      // s.maxPossibleTabIndex = 0;
    }
  }

  parseToTabIndex(day: number) {
    return day - 1;
  }

  // when going back to the first week, this can cause a bug:
  //2nd week on thursday tab -> go to 1st week -> thursday tab is still open even if deactivated
  getNextEnabledTab() {
    if (this.calendarWeekIndex === 0) {
      console.log('the current tab should be: ', this.maxPossibleTabIndex);
      this.currentTab = this.maxPossibleTabIndex;
      this.tabGroup.selectedIndex = this.currentTab;
      console.log('selected-index', this.tabGroup.selectedIndex);
    }
  }
}
