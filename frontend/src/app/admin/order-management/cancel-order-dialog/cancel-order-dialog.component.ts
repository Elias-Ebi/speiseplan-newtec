import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { ApiService } from 'src/app/shared/services/api.service';
import { Order } from 'src/app/shared/models/order';
import { SnackbarService } from "../../../shared/services/snackbar.service";

@Component({
  selector: 'app-cancel-order-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule],
  templateUrl: './cancel-order-dialog.component.html',
  styleUrls: ['./cancel-order-dialog.component.scss']
})
export class CancelOrderDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public order: Order,
    private dialogRef: MatDialogRef<CancelOrderDialogComponent>,
    private snackbarService: SnackbarService,
    private apiService: ApiService
  ) {
  }

  async closeDialog(isCancelingOrderConfirmed: boolean) {
    if (isCancelingOrderConfirmed) {
      await this.apiService.deleteOrder(this.order.id)
        .then(() => {
          this.snackbarService.success("Bestellungen erfolgreich storniert!");
        })
        .catch(() => {
          this.snackbarService.error("Bestellungen konnten nicht storniert werden.")
        });
    }
    this.dialogRef.close();
  }
}
