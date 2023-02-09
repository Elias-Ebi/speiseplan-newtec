import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FullDatePipe } from "../../../shared/pipes/full-date.pipe";
import { OrderCardComponent } from "../../shared/components/order-card/order-card.component";
import { ApiService } from "../../../shared/services/api.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { MatInputModule } from "@angular/material/input";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { GuestOrderDialogValues, OrderDay } from "../order.models";

@Component({
  selector: 'app-guest-order-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FullDatePipe, OrderCardComponent, MatSnackBarModule, MatInputModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './guest-order-dialog.component.html',
  styleUrls: ['./guest-order-dialog.component.scss']
})
export class GuestOrderDialogComponent {
  form = this.initializeForm();
  selectedIds: string[] = [];

  constructor(@Inject(MAT_DIALOG_DATA)
              public orderDay: OrderDay,
              private dialogRef: MatDialogRef<GuestOrderDialogComponent>,
              private apiService: ApiService,
              private snackBar: MatSnackBar,
              private fb: FormBuilder
  ) {
  }

  get values(): GuestOrderDialogValues {
    return {guestName: this.form.value.guestName, mealIds: this.selectedIds};
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
    const orderMeal = this.orderDay.orderMeals[index];

    if (!orderMeal.ordered) {
      this.selectedIds.push(orderMeal.id);
    } else {
      this.selectedIds = this.selectedIds.filter((id) => id != orderMeal.id);
    }

    orderMeal.ordered = !orderMeal.ordered;
  }
}
