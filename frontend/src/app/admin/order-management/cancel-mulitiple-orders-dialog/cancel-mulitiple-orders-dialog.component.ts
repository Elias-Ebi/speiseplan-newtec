import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';
import { Order } from 'src/app/shared/models/order';

@Component({
  selector: 'app-cancel-order-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, MatSnackBarModule],
  templateUrl: './cancel-mulitiple-orders-dialog.component.html',
  styleUrls: ['./cancel-mulitiple-orders-dialog.component.scss']
})
export class CancelMultipleOrdersDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public orders: Order[],
    private dialogRef: MatDialogRef<CancelMultipleOrdersDialogComponent>,
    private snackBar: MatSnackBar,
    private apiService: ApiService,
  ) {
  }

  async closeDialog(isCancelingOrderConfirmed: boolean) {
    if (isCancelingOrderConfirmed) {
      try {
        const res = await this.apiService.deleteMultipleOrdersAdmin(this.orders);
        this.snackBar.open("Bestellung erfolgreich storniert!", "OK", {
          duration: 3000,
          panelClass: 'success-snackbar'
        })
      } catch (e) {
        console.error(e);
      }
    }
    this.dialogRef.close();
  }
}
