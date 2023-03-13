import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/shared/services/api.service';
import { MealTemplate } from 'src/app/shared/models/meal-template';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import * as _ from "lodash";
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Category, CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'app-add-dish-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    FormsModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './add-dish-dialog.component.html',
  styleUrls: ['./add-dish-dialog.component.scss'],
})
export class AddDishDialogComponent implements OnInit {
  MAX_LENGTH: number = 70;
  orderTime: string;
  deliveryTime: string;
  isFormValid: boolean = false;
  areDatesValid = true;
  validationHint = '';
  isTemplateValid: boolean = false;
  name: string;
  description: string;
  categoryId: string;
  deliveryDate: Date;
  orderableDate: Date;
  minDate: Date;
  maxDate: Date;
  total: number;

  categories: Category[];


  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: { weekday: string, deliveryDate: Date, selectedMealTemplate: MealTemplate | undefined },
    private matDialogRef: MatDialogRef<AddDishDialogComponent>,
    private api: ApiService,
    private categoryService: CategoryService,
    private dateAdapter: DateAdapter<any>,
    private snackBar: MatSnackBar
  ) {
    this.dateAdapter.setLocale('de');
    this.categories = this.categoryService.getAllCategories();
    if (data.selectedMealTemplate) {
      this.name = data.selectedMealTemplate.name;
      this.description = data.selectedMealTemplate.description;
      this.categoryId = data.selectedMealTemplate.categoryId;
      this.validate();
    } else {
      this.name = '';
      this.description = '';
      this.categoryId = '';
    }
    this.validateTemplate();
    this.deliveryDate = data.deliveryDate;
    this.orderableDate = _.cloneDeep(data.deliveryDate);
    this.orderableDate = this.setOrderableDate();
    this.orderTime = '00:00';
    this.deliveryTime = '00:00';
    this.total = 0.0;

    // let yesterday.setDate(new Date() - 1);
    this.minDate = new Date();
    this.maxDate = new Date();
    this.maxDate.setDate(this.deliveryDate.getDate() - 1);
  }

  async ngOnInit() {
    const defaultValues = await this.api.getDefaultValues();
    this.total = defaultValues.total;
    this.deliveryTime = defaultValues.deliveryTime;
    this.orderTime = defaultValues.orderableTime;
  }

  setOrderableDate() {
    let date = new Date();
    if (this.data.weekday === 'monday') {
      date.setDate(this.deliveryDate.getDate() - 3);
    } else {
      date.setDate(this.deliveryDate.getDate() - 1);
    }
    return date;
  }

  closeDialog() {
    this.matDialogRef.close({});
  }

  createMeal() {
    // 2023-01-24T12:00:00
    var deliveryDateWithTime = this.formatDateWithTime(this.deliveryDate, this.deliveryTime);
    var orderableDateWithTime = this.formatDateWithTime(this.orderableDate, this.orderTime);
    var deliveryDateString = this.formatDate(this.deliveryDate);


    let meal: any = {
      name: this.name,
      description: this.description,
      categoryId: this.categoryId,
      date: deliveryDateString,
      delivery: deliveryDateWithTime,
      orderable: orderableDateWithTime,
      total: this.total,
      orderCount: 0,
    };

    this.matDialogRef.close(
      {mealToAdd: meal, useTemplate: false}
    );
  }

  openTemplateDialog() {
    this.matDialogRef.close(
      {mealToAdd: {}, useTemplate: true}
    );
  }

  async saveAsTemplate() {
    let mealTemplate: MealTemplate = {
      name: this.name,
      description: this.description,
      categoryId: this.categoryId,
    };
    try {
      await this.api.putMealTemplate(mealTemplate);
      this.snackBar.open("Vorlage gespeichert!", "OK", {
        duration: 3000,
        panelClass: 'success-snackbar'
      });
    } catch (error) {
      this.snackBar.open("Vorlage konnte nicht gespeichert werden.", "OK", {
        duration: 3000,
        panelClass: 'success-snackbar'
      });
    }
  }

  formatDateWithTime(date: Date, time?: string): string {
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    var dateWithTime = date.getFullYear() + '-' + month + '-' + day + "T";
    if (time) {
      dateWithTime = dateWithTime + time + ":00"
    } else {
      dateWithTime = dateWithTime + date.getHours().toString().padStart(2, '0')
        + ":"
        + date.getMinutes().toString().padStart(2, '0')
        + ":"
        + date.getSeconds().toString().padStart(2, '0');

    }
    return dateWithTime;
  }

  formatDate(date: Date): string {
    let month = (date.getMonth() + 1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    return date.getFullYear() + '-' + month + '-' + day;
  }

  validate() {
    // TODO:check dates & time
    this.isFormValid = (this.name.length != 0) && (this.description.length != 0) && (this.categoryId.length != 0);
    this.validateTemplate();
    this.validateDate();
  }

  validateTemplate() {
    this.isTemplateValid = (this.name.length != 0) && (this.description.length != 0) && (this.categoryId.length != 0);
  }

  validateDate() {
    // check if orderable date is later than delivery date
    if (this.deliveryDate && this.orderableDate) {
      if (this.orderableDate > this.deliveryDate) {
        this.isFormValid = false;
        this.areDatesValid = false;
        this.validationHint = 'Das Bestelldatum darf nicht hinter dem Lieferdatum liegen.';
        // check if delivery date or orderable date is on a weekend
      } else if (this.deliveryDate.getDay() == 6 || this.deliveryDate.getDay() == 0) {
        this.isFormValid = false;
        this.areDatesValid = false;
        this.validationHint = 'Das Lieferdatum darf nicht auf einem Wochenendtag liegen.';
      } else if (this.orderableDate.getDay() == 6 || this.orderableDate.getDay() == 0) {
        this.isFormValid = false;
        this.areDatesValid = false;
        this.validationHint = 'Das Bestelldatum darf nicht auf einem Wochenendtag liegen.';
      } else {
        this.validationHint = ''
        this.areDatesValid = true;
      }
    }
  }

  dateWeekendFilter(date: Date | null): boolean {
    //prevent saturdays and sundays from being selected
    const day = (date || new Date()).getDay();
    return day !== 0 && day !== 6;
  }
}
