import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { FullDatePipe } from "../../../shared/pipes/full-date.pipe";
import { HomeUnchangeableOrderDay } from "../home.models";
import {ApiService} from "../../../shared/services/api.service";
import {SnackbarService} from "../../../shared/services/snackbar.service";

@Component({
  selector: 'app-bandit-plate-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FullDatePipe],
  templateUrl: './bandit-plate-dialog.component.html',
  styleUrls: ['./bandit-plate-dialog.component.scss']
})
export class BanditPlateDialogComponent {

  constructor(
    @Inject(MAT_DIALOG_DATA) public banditPlateDays: HomeUnchangeableOrderDay[],
    private dialogRef: MatDialogRef<BanditPlateDialogComponent>,
    private apiService: ApiService,
    private snackbarService: SnackbarService,
) {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async takeBandit (orderId: string) {
    this.apiService.takeBanditPlate(orderId).then(async (order) => {

      this.closeDialog();
      this.snackbarService.success(`${order.meal.name} erfolgreich übernommen.`);
    })
      .catch((err) => {
        this.snackbarService.error(`Der Räuberteller konnte nicht übernommen werden! ${err.message.message}`);
      });
  }
}
