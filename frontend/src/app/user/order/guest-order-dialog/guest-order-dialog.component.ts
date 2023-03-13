import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FullDatePipe } from "../../../shared/pipes/full-date.pipe";
import { OrderCardComponent } from "../../shared/components/order-card/order-card.component";
import { MatInputModule } from "@angular/material/input";
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { GuestOrderDialogValues, OrderDay } from "../order.models";

@Component({
  selector: 'app-guest-order-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FullDatePipe, OrderCardComponent, MatInputModule, ReactiveFormsModule, MatDialogModule],
  templateUrl: './guest-order-dialog.component.html',
  styleUrls: ['./guest-order-dialog.component.scss']
})
export class GuestOrderDialogComponent {
  form = this.initializeForm();
  selectedIds = new Set<string>();

  constructor(
    @Inject(MAT_DIALOG_DATA) public orderDay: OrderDay,
    private dialogRef: MatDialogRef<GuestOrderDialogComponent>,
    private fb: FormBuilder
  ) {
  }

  get values(): GuestOrderDialogValues {
    const guestName = this.form.value.guestName;
    const mealIds = Array.from(this.selectedIds);

    return {guestName, mealIds};
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
    const id = orderMeal.id;

    orderMeal.ordered ? this.selectedIds.delete(id) : this.selectedIds.add(id);

    orderMeal.ordered = !orderMeal.ordered;
  }
}
