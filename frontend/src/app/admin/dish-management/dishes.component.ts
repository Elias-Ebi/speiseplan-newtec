import { Component, OnInit, ViewChild } from '@angular/core';
import { Temporal } from '@js-temporal/polyfill';
import { MonthNamePipe } from '../../shared/pipes/month-name.pipe';
import { JsonPipe } from '@angular/common';
import { WeekdayNamePipe } from '../../shared/pipes/weekday-name.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChooseDishDialogComponent } from './choose-dish-dialog/choose-dish-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MealTemplate } from 'src/app/shared/models/meal-template';
import { ApiService } from 'src/app/shared/services/api.service';
import { Meal } from 'src/app/shared/models/meal';
import { CalendarWeek } from 'src/app/shared/models/calendar-week';
import { AddDishDialogComponent } from './add-dish-dialog/add-dish-dialog.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DeleteDishDialogComponent } from './delete-dish-dialog/delete-dish-dialog.component';
import { DefaultSettingsDialogComponent } from './default-settings-dialog/default-settings-dialog.component';
import { CategoryService } from "../../shared/services/category.service";
import { SnackbarService } from "../../shared/services/snackbar.service";
import {MatBadgeModule} from '@angular/material/badge';

@Component({
  selector: 'app-dish-management',
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
    MatBadgeModule
  ],
  styleUrls: ['./dishes.component.scss'],
})
export class DishesComponent implements OnInit {
  @ViewChild('tabs', {static: false}) tabGroup!: MatTabGroup;

  MAX_FOLLOWING_WEEKS = 2;
  displayedColumns: string[] = ['title', 'description', 'category', 'action'];
  dataSource = new MatTableDataSource<Meal>();
  weekdayProperty = 'monday';
  currentlyDisplayedWeek: CalendarWeek = new CalendarWeek(
    Temporal.Now.plainDateISO()
  );
  currentTab: number = 0;
  calendarWeekIndex = 0;
  maxPossibleTabIndex = 0;
  weekCounter = [0,0,0,0,0];

  constructor(
    public dialog: MatDialog,
    private api: ApiService,
    private snackbarService: SnackbarService,
    private categoryService: CategoryService
  ) {
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
        Temporal.Now.plainDateISO().add({days: 7})
      );
    } else {
      this.currentlyDisplayedWeek = await this.getCalenderWeek(
        Temporal.Now.plainDateISO()
      );
    }

    await this.updateTableSource();
  }

  getCategoryName(id: string): string | undefined {
    return this.categoryService.getCategory(id)?.name;
  }

  create(selectedMealTemplate?: MealTemplate, mealToEdit?: Meal) {
    this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
    let currentDay =
      this.currentlyDisplayedWeek[this.weekdayProperty].date.toString();

    const dialogRef = this.dialog.open(AddDishDialogComponent, {
      data: {
        weekday: this.weekdayProperty,
        deliveryDate: new Date(currentDay),
        selectedMealTemplate,
        mealToEdit,
      },
      autoFocus: false,
    });

    dialogRef
      .afterClosed()
      .subscribe(async (mealData: { mealToAdd: any; useTemplate: boolean }) => {
        if (JSON.stringify(mealData) !== '{}') {
          if (mealData.useTemplate) {
            const dialogRef = this.dialog.open(ChooseDishDialogComponent, {
              data: {},
              autoFocus: false,
            });

            dialogRef
              .afterClosed()
              .subscribe(async (selectedMealTemplate: any) => {
                if (JSON.stringify(selectedMealTemplate) !== '{}') {
                  this.create(selectedMealTemplate, mealToEdit);
                }
              });
          } else {
            if (!mealToEdit) {
              this.currentlyDisplayedWeek[this.weekdayProperty].dishes.push(
                mealData.mealToAdd
              );
              await this.api.addMeal(mealData.mealToAdd);
            } else {
              mealData.mealToAdd.id = mealToEdit.id;
              await this.api.updateMeal(mealData.mealToAdd);
            }
            await this.updateTableSource();
          }
        }
      });
  }

  edit(meal: Meal) {
    this.create(undefined, meal)
  }

  delete(meal: Meal) {
    const dialogRef = this.dialog.open(DeleteDishDialogComponent, {
      data: {name: meal.name},
    });

    dialogRef
      .afterClosed()
      .subscribe(async (data: { isDeletingDishConfirmed: boolean }) => {
        if (!data.isDeletingDishConfirmed) {
          return;
        }

        await this.api.deleteMeal(meal.id)
          .then(() => {
            this.snackbarService.success('Gericht erfolgreich gelöscht!');
          })
          .catch(() => {
            this.snackbarService.error('Gericht konnte nicht gelöscht werden.');
          });
        await this.updateTableSource();
      });
  }

  editDefaultSettings() {
    this.dialog.open(DefaultSettingsDialogComponent, {autoFocus: false});
  }

  async onTabChange(event: any) {
    this.currentTab = Number.parseInt(event.index);
    this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
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
      this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
      this.tabGroup.selectedIndex = this.maxPossibleTabIndex;
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
    this.dataSource.data = await this.api.getMealsOn(this.currentlyDisplayedWeek[this.weekdayProperty].date);
    await this.updateBadgesForCalendarWeek();
  }

  async updateBadgesForCalendarWeek() {
    this.weekCounter = await this.api.getMealCountForWeek(this.currentlyDisplayedWeek.monday.date);
  }

  async disableImpossibleTabs() {
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
      const currentIndex = new Date().getDay() - 1;
      if (currentIndex < 4) {
        this.currentTab = currentIndex + 1;
      }
      // dates are the same, it is the current monday. disable monday, as it is not possible to make a new dish here
      if (isMondayInThePast === 0) {
        this.weekdayProperty = this.getWeekdayPropertyFromIndex(
          this.currentTab
        );
        this.maxPossibleTabIndex = this.currentTab;
        await this.updateTableSource();
        // the monday is in the past, disable every tab before the current tab
      } else if (isMondayInThePast === 1) {
        this.weekdayProperty = this.getWeekdayPropertyFromIndex(
          this.currentTab
        );
        this.maxPossibleTabIndex = this.currentTab;
        await this.updateTableSource();
      }
    }
  }
}
