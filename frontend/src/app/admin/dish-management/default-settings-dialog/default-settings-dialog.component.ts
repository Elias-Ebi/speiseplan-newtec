import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DefaultValues } from 'src/app/shared/models/default-values';
import { MatDialogRef, } from '@angular/material/dialog';
import { ApiService } from 'src/app/shared/services/api.service';
import { SnackbarService } from "../../../shared/services/snackbar.service";

@Component({
  selector: 'app-default-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    MatIconModule,
    MatDividerModule,
  ],
  templateUrl: './default-settings-dialog.component.html',
  styleUrls: ['./default-settings-dialog.component.scss'],
})
export class DefaultSettingsDialogComponent implements OnInit {
  startDefaultValues: DefaultValues;
  currentDefaultValues: DefaultValues;

  constructor(
    private api: ApiService,
    private dialog: MatDialogRef<DefaultSettingsDialogComponent>,
    private snackbarService: SnackbarService
  ) {
    const defaultValues = {total: 0, deliveryTime: '', orderableTime: ''};
    this.startDefaultValues = {...defaultValues};
    this.currentDefaultValues = {...defaultValues};
  }

  get invalid() {
    const unchangedTotal = this.currentDefaultValues.total === this.startDefaultValues.total;
    const unchangedOrderableTime = this.currentDefaultValues.orderableTime === this.startDefaultValues.orderableTime;
    const invalidOrderableTime = !this.currentDefaultValues.orderableTime;
    return unchangedTotal && unchangedOrderableTime || invalidOrderableTime;
  }

  async ngOnInit() {
    const defaultValues = await this.api.getDefaultValues();
    this.currentDefaultValues = {...defaultValues};
    this.startDefaultValues = {...defaultValues};
  }

  transformInput() {
    const total = this.currentDefaultValues.total;
    this.currentDefaultValues.total = parseFloat(total?.toFixed(2)) || 0;
  }

  async applyChanges() {
    await this.api.setDefaultValues(this.currentDefaultValues)
      .then(() => {
        this.snackbarService.success('Standardwerte erfolgreich angepasst!');
      })
      .catch(() => {
        this.snackbarService.error('Standardwerte konnten nicht gespreichert werden.');
      });

    this.closeDialog();
  }

  closeDialog() {
    this.dialog.close();
  }
}
