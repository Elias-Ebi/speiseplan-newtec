import { AfterViewInit, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTab, MatTabChangeEvent, MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Meal } from 'src/app/shared/models/meal';
import { CategoryService } from 'src/app/shared/services/category.service';
import { MealTemplate } from 'src/app/shared/models/meal-template';
import { CalendarWeek } from 'src/app/shared/models/calendar-week';
import { Temporal } from '@js-temporal/polyfill';
import { MatDialog } from '@angular/material/dialog';
import { AddMealDialogComponent } from '../../dialogs/add-meal-dialog/add-meal-dialog.component';
import { ChooseMealDialogComponent } from '../../dialogs/choose-meal-dialog/choose-meal-dialog.component';
import { ApiService } from 'src/app/shared/services/api.service';
import { DeleteMealDialogComponent } from '../../dialogs/delete-meal-dialog/delete-meal-dialog.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'app-meal-tab',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './meal-tab.component.html',
  styleUrls: ['./meal-tab.component.scss']
})
export class MealTabComponent implements OnInit, OnChanges {
  @Input()
  public calendarWeekIndex!: number;
  @Input()
  public maxPossibleTabIndex!: number;
  @Input()
  public currentlyDisplayedWeek!: CalendarWeek;
  @Input()
  public weekdayProperty!: string;
  @Input()
  public currentTab!: number;

  @Output() weekCounterEmitter = new EventEmitter<number[]>();

  weekCounter: number[] = [0, 0, 0, 0, 0];

  @ViewChild('tabs') tabs!: MatTabGroup;

  dataSource = new MatTableDataSource<Meal>();
  displayedColumns: string[] = ['title', 'description', 'category', 'action'];

  MAX_DESC_LENGTH = 100;
  MAX_MEAL_LENGTH = 25;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private api: ApiService,
    private snackbarService: SnackbarService
  ) {
  }

  async ngOnChanges(changes: SimpleChanges) {
    try {
      this.currentlyDisplayedWeek = await changes['currentlyDisplayedWeek'].currentValue;
    } finally {
      await this.updateTableSource();
    }

    try {
      if (changes.hasOwnProperty('calendarWeekIndex')) {
        if (changes['calendarWeekIndex'].firstChange) {
          this.calendarWeekIndex = changes['calendarWeekIndex'].currentValue;
        }
      }
    } catch (error) {
      console.log("couldn't get calendarWeekIndex");
    } finally {
      await this.updateTableSource();
    }
  }

  async ngOnInit() {
    let date: Temporal.PlainDate = Temporal.Now.plainDateISO();
    switch (date.dayOfWeek) {
      case 5:
        this.currentlyDisplayedWeek = await this.getCalenderWeek(Temporal.Now.plainDateISO().add({ days: 7 }));
        break;
      case 6:
        this.currentlyDisplayedWeek = await this.getCalenderWeek(Temporal.Now.plainDateISO().add({ days: 7 }));
        break;
      case 7:
        this.currentlyDisplayedWeek = await this.getCalenderWeek(Temporal.Now.plainDateISO().add({ days: 7 }));
        break;
      default:
        this.currentlyDisplayedWeek = new CalendarWeek(date);
        break;
    }
    await this.updateTableSource();
  }

  async getCalenderWeek(date: Temporal.PlainDate): Promise<CalendarWeek> {
    return new CalendarWeek(date);
  }

  async onTabChange(event: MatTabChangeEvent) {
    this.currentTab = event.index;
    this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
    await this.updateTableSource();
  }

  getCategoryName(id: string): string | undefined {
    return this.categoryService.getCategory(id)?.name;
  }

  create(selectedMealTemplate?: MealTemplate, mealToEdit?: Meal) {
    this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
    let currentDay =
      this.currentlyDisplayedWeek[this.weekdayProperty].date.toString();

    const dialogRef = this.dialog.open(AddMealDialogComponent, {
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
            const dialogRef = this.dialog.open(ChooseMealDialogComponent, {
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
    const dialogRef = this.dialog.open(DeleteMealDialogComponent, {
      data: { name: meal.name },
      autoFocus: false
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
    } else {
      throw new Error('Unknown index');
    }
  }

  async updateTableSource() {
    try {
      this.dataSource.data = await this.api.getMealsOn(this.currentlyDisplayedWeek[this.weekdayProperty].date);
      await this.updateBadgesForCalendarWeek();
    } catch (error) {
      this.snackbarService.error('Could not load meals');
    }
  }

  async updateBadgesForCalendarWeek() {
    this.weekCounter = await this.api.getMealCountForWeek(this.currentlyDisplayedWeek.monday.date);
    this.weekCounterEmitter.emit(this.weekCounter);
  }

  minimalize(description: string, max_length: number): string {
    return description.length > max_length
      ? description.substring(0, max_length - 4) + ' ...'
      : description;
  }

  extend(description: string, max_length: number): string {
    let normalizedDescription = '';
    if (description.length > max_length) {
      if (description.includes(" ")) {
        normalizedDescription = description.replace(" ", "\n");
      } else {
        for (let i = 0; i < description.length; i++) {
          if (i % max_length === 0 && i != 0) {
            normalizedDescription += description[i] + "\n";
          } else {
            normalizedDescription += description[i];
          }
        }
      }
    } else {
      normalizedDescription = description;
    }
    return normalizedDescription;
  }

  toggleShowMore(element: any): boolean {
    return (element.showMore = !element.showMore);
  }
}
