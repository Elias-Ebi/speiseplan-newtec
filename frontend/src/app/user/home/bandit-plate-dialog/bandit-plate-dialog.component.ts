import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { Order } from "../../../shared/models/order";
import { Temporal } from "@js-temporal/polyfill";
import { DateService } from "../../../shared/services/date.service";
import { FullDatePipe } from "../../../shared/pipes/full-date.pipe";
import PlainDate = Temporal.PlainDate;

@Component({
  selector: 'app-bandit-plate-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FullDatePipe],
  templateUrl: './bandit-plate-dialog.component.html',
  styleUrls: ['./bandit-plate-dialog.component.scss']
})
export class BanditPlateDialogComponent {
  date: PlainDate;

  constructor(@Inject(MAT_DIALOG_DATA) public banditPlates: Order[], private dialogRef: MatDialogRef<BanditPlateDialogComponent>, private dateService: DateService) {
    this.date = this.dateService.getLatestUnchangeableDate();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
