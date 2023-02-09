import {Component, Inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {FullDatePipe} from "../../../shared/pipes/full-date.pipe";
import {OrderDay} from "../models/order-day";
import {OrderCardComponent} from "../../shared/components/order-card/order-card.component";
import {ApiService} from "../../../shared/services/api.service";
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";
import {MatInputModule} from "@angular/material/input";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-guest-order-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FullDatePipe, OrderCardComponent, MatSnackBarModule, MatInputModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './guest-order-dialog.component.html',
  styleUrls: ['./guest-order-dialog.component.scss']
})
export class GuestOrderDialogComponent {
  form = this.initializeForm();
  guestOrderMealIds: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA)
              public guestOrderDay: OrderDay,
              private dialogRef: MatDialogRef<GuestOrderDialogComponent>,
              private apiService: ApiService,
              private snackBar: MatSnackBar,
              private fb: FormBuilder
  ) {
  }

  initializeForm(): FormGroup {
    return this.fb.group({
      guestName: ['']
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  updateOrdered(index: number) {
    const orderMeal = this.guestOrderDay.orderMeals[index];
    orderMeal.ordered = !orderMeal.ordered;
  }

  async orderGuestMeals() {
    this.guestOrderMealIds = this.guestOrderDay.orderMeals.filter((orderMeal) => orderMeal.ordered).map((orderMeal) => orderMeal.id);
  }

  get values (): {guestName: string, mealIds: string[]} {
    return {guestName: this.form.value.guestName, mealIds: this.guestOrderMealIds};
  }

}
