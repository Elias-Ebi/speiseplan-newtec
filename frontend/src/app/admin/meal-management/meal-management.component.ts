import { Component, EventEmitter, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Temporal } from '@js-temporal/polyfill';
import { MonthNamePipe } from '../../shared/pipes/month-name.pipe';
import { CommonModule, JsonPipe } from '@angular/common';
import { WeekdayNamePipe } from '../../shared/pipes/weekday-name.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarWeek } from 'src/app/shared/models/calendar-week';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { DefaultSettingsDialogComponent } from './dialogs/default-settings-dialog/default-settings-dialog.component';
import { MealTabComponent } from "./components/meal-tab/meal-tab.component";
import { MatBadgeModule } from '@angular/material/badge';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-dish-management',
  standalone: true,
  templateUrl: './meal-management.component.html',
  styleUrls: ['./meal-management.component.scss'],
  imports: [
    CommonModule,
    MonthNamePipe,
    JsonPipe,
    WeekdayNamePipe,
    MatIconModule,
    MatTabsModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MealTabComponent,
    MatBadgeModule
  ]
})
export class MealManagementComponent implements OnInit {
  @Output()
  tabChangeEvent = new EventEmitter<number>();

  @ViewChild('tabs', { static: false }) tabGroup!: MatTabGroup;
  @ViewChildren(MealTabComponent) mealTabComponents!: QueryList<MealTabComponent>;

  MAX_FOLLOWING_WEEKS = 2;
  weekdayProperty = 'monday';
  currentlyDisplayedWeek: CalendarWeek = new CalendarWeek(
    Temporal.Now.plainDateISO()
  );
  currentTab: number = 0;
  calendarWeekIndex = 0;
  maxPossibleTabIndex = 0;

  weekCounter: number[] = [0, 0, 0, 0, 0];

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private snackBarService: SnackbarService
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
        Temporal.Now.plainDateISO().add({ days: 7 })
      );
    } else {
      this.currentlyDisplayedWeek = await this.getCalenderWeek(
        Temporal.Now.plainDateISO()
      );
    }
  }

  setWeekCounter(event: number[]) {
    this.weekCounter = event;
  }

  editDefaultSettings() {
    this.dialog.open(DefaultSettingsDialogComponent, { autoFocus: false });
  }

  async notifyUsers() {
    const notify = await this.authService.notifyUsers();
    if(notify) {
      this.snackBarService.success('Benachrichtigung erfolgreich versendet');
    } else {
      this.snackBarService.error('Benachrichtigung konnte nicht versendet werden');
    }
  }

  async onTabChange(event: MatTabChangeEvent) {
    this.mealTabComponents.get(event.index)?.onTabChange(event)
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
      let lastIndex = this.tabGroup.selectedIndex ? this.tabGroup.selectedIndex : this.currentTab;
      if (this.calendarWeekIndex == 0) {
        if (lastIndex <= this.maxPossibleTabIndex) {
          this.tabGroup.selectedIndex = this.maxPossibleTabIndex;
        }
      }
    }
  }

  async getCalenderWeek(date: Temporal.PlainDate): Promise<CalendarWeek> {
    await this.disableImpossibleTabs();
    return new CalendarWeek(date);
  }

  getWeekdayPropertyFromIndex(index: number): string {
    if (index == 0) {
      return 'monday';
    } else if (index == 1) {
      return 'tuesday';
    } else if (index == 2) {
      return 'wednesday';
    } else if (index == 3) {
      return 'thursday';
    } else if (index == 4) {
      return 'friday';
    }
    throw new Error('Unknown index');
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
        // the monday is in the past, disable every tab before the current tab
      } else if (isMondayInThePast === 1) {
        this.weekdayProperty = this.getWeekdayPropertyFromIndex(
          this.currentTab
        );
        this.maxPossibleTabIndex = this.currentTab;
      }
    }
  }
}
