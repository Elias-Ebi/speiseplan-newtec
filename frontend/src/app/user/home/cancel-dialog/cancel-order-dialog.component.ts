import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FullDatePipe } from "../../../shared/pipes/full-date.pipe";
import { ApiService } from "../../../shared/services/api.service";
import { SnackbarService } from "../../../shared/services/snackbar.service";
import { Temporal } from "@js-temporal/polyfill";
import PlainDate = Temporal.PlainDate;

@Component({
  selector: 'app-cancel-order-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FullDatePipe],
  templateUrl: './cancel-order-dialog.component.html',
  styleUrls: ['./cancel-order-dialog.component.scss']
})
export class CancelOrderDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public date: PlainDate,
    private dialogRef: MatDialogRef<CancelOrderDialogComponent>,
    private apiService: ApiService,
    private snackbarService: SnackbarService,
  ) {
  }

  closeDialog() {
    this.dialogRef.close(false);
  }

  async deleteOrdersOn(date: PlainDate) {
    await this.apiService.deleteOrdersOn(date).then(async () => {

      this.dialogRef.close(true);
      this.snackbarService.success(`Alle Bestellungen erfolgreich storniert.`);
    })
      .catch((err) => {
        this.snackbarService.error(`Bestellungen konnten nicht storniert werden! ${err.message.message}`);
      });
  }
}
