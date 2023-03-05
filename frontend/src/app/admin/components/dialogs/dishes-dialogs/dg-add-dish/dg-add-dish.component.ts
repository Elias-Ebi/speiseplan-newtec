import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MAT_DIALOG_DATA,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from 'src/app/shared/services/api.service';
import { MealTemplate } from 'src/app/shared/models/mealtemplate';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule } from '@angular/material/core';
import { Temporal } from '@js-temporal/polyfill';
import * as _ from "lodash";
import { Meal } from 'src/app/shared/models/meal';

interface Category {
  value: string;
  view: string;
}

@Component({
  selector: 'app-dg-add-dish',
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
  ],
  templateUrl: './dg-add-dish.component.html',
  styleUrls: ['./dg-add-dish.component.scss'],
})
export class DgAddDishComponent {
  MAX_LENGTH: number = 70;
  time: string;
  isFormValid: boolean = false;
  name: string;
  description: string;
  categoryId: string;
  deliveryDate: Date;
  orderableDate: Date;

  categories: Category[] = [
    { value: '44c615e8-80e4-40c9-b026-70f96cd21dcd', view: 'Fleisch' },
    { value: '6f8b2947-4784-4c61-b973-705b314ef4f6', view: 'Vegetarisch' },
    { value: 'af03df2a-0d22-4e7d-8a12-9269ecd318af', view: 'Vegan' },
    { value: '85d77591-0b55-4df4-93b0-03c00bcb14b9', view: 'Salat' },
  ];


  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {deliveryDate: Date},
    private matDialogRef: MatDialogRef<DgAddDishComponent>,
    private api: ApiService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.dateAdapter.setLocale('de');
    this.name = '';
    this.description = '';
    this.categoryId = '';
    this.deliveryDate = this.data.deliveryDate;
    this.orderableDate = _.cloneDeep(this.data.deliveryDate);
    this.orderableDate.setDate(this.deliveryDate.getDate() - 1);
    this.time = '13:00';
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

  onClickCancel() {
    this.matDialogRef.close({});
  }

  onClickCreate() {
    // 2023-01-24T12:00:00
    var deliveryDateWithTime = this.formatDateWithTime(this.deliveryDate);
    var orderableDateWithTime = this.formatDateWithTime(this.orderableDate, this.time);
    var deliveryDateString = this.formatDate(this.deliveryDate);


    let meal: Meal = {
      id: '',
      name: this.name,
      description: this.description,
      categoryId: this.categoryId,
      date: deliveryDateString,
      delivery: deliveryDateWithTime,
      orderable: orderableDateWithTime,
      total: 0,
      orderCount: 0,
    };

    console.log(meal.delivery, meal.orderable, meal.date);

    //this.api.putMealTemplate(mealTemplate);
    this.matDialogRef.close({
      name: this.name,
      description: this.description,
      categoryId: this.categoryId,
      deliveryDate: this.deliveryDate
    });
  }

  onClickTest() {
    if(this.isFormValid) {
      console.log([this.name, this.description, this.getCategoryView(this.categoryId)]);
    }
  }

  formatDateWithTime(date: Date, time?: string): string {
    let month = (date.getMonth()+1).toString().padStart(2, '0');
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
    let month = (date.getMonth()+1).toString().padStart(2, '0');
    let day = date.getDate().toString().padStart(2, '0');
    var formatedDate = date.getFullYear() + '-' + month + '-' + day;
    return formatedDate;
  }

  validate() {
    this.isFormValid = (this.name != undefined) && (this.description != undefined) && (this.categoryId != undefined);
  }

  checkDate(event: MatDatepickerInputEvent<any>){
    // Todo: check if valid date
  }
}
