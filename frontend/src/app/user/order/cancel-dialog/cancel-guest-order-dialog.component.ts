import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FullDatePipe } from "../../../shared/pipes/full-date.pipe";
import {ApiService} from "../../../shared/services/api.service";
import {SnackbarService} from "../../../shared/services/snackbar.service";
import {GuestOrderCancelDialogValues} from "../order.models";

@Component({
  selector: 'app-cancel-guest-order-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FullDatePipe],
  templateUrl: './cancel-guest-order-dialog.component.html',
  styleUrls: ['./cancel-guest-order-dialog.component.scss']
})
export class CancelGuestOrderDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GuestOrderCancelDialogValues,
    private dialogRef: MatDialogRef<CancelGuestOrderDialogComponent>,
    private apiService: ApiService,
    private snackbarService: SnackbarService,
) {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  async deleteOrder(orderId: string) {
    return this.apiService.deleteOrder(orderId).then(async (order) => {
      this.dialogRef.close(true);
      this.snackbarService.success(`${order.meal.name} erfolgreich storniert.`);
    }).catch((err) => {
      this.snackbarService.error(`Bestellung konnte nicht storniert werden! ${err.message.message}`);
    });
  }


}
