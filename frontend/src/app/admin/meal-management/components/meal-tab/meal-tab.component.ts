import { AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
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
export class MealTabComponent implements OnInit, AfterViewInit {
  @Input()
  public calendarWeekIndex: number = 0;
  @Input()
  public maxPossibleTabIndex: number = 0;
  @Input()
  public currentlyDisplayedWeek: CalendarWeek = new CalendarWeek(Temporal.Now.plainDateISO());
  @Input()
  public weekdayProperty = 'monday';
  @Input()
  public currentTab: number = 0;

  @ViewChild('tabs') tabs!: MatTabGroup;

  dataSource = new MatTableDataSource<Meal>();
  displayedColumns: string[] = ['title', 'description', 'category', 'action'];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private api: ApiService,
    private snackbarService: SnackbarService
  ) {
  }

  async ngOnInit() {
    await this.onTabChange({index: 0, tab: this.tabs._tabs.toArray()[0]});
  }

  async ngAfterViewInit() {
    await this.onTabChange({index: 0, tab: this.tabs._tabs.toArray()[0]});
  }

  async onTabChange(event: MatTabChangeEvent) {
    this.currentTab = event.index;
    this.weekdayProperty = this.getWeekdayPropertyFromIndex(this.currentTab);
    console.log('ITS MY TIME TO SHINE! - I AM ', event.tab.textLabel)
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
    console.log(this.currentlyDisplayedWeek[this.weekdayProperty]['date'].toString());
    this.dataSource.data = await this.api.getMealsOn(this.currentlyDisplayedWeek[this.weekdayProperty].date);
  }
}
