import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DefaultValues } from 'src/app/shared/models/default-values';
import {
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';

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
  formattedTotal: any;
  maxLength = 3;

  constructor(
    private api: ApiService,
    private dialog: MatDialogRef<DefaultSettingsDialogComponent>,
    private snackBar: MatSnackBar
  ) {
    this.startDefaultValues = { total: 0, deliveryTime: '', orderableTime: '' };
    this.currentDefaultValues = {
      total: 0,
      deliveryTime: '',
      orderableTime: '',
    };
  }

  async ngOnInit() {
    this.currentDefaultValues = await this.api.getDefaultValues();
    this.startDefaultValues = await this.api.getDefaultValues();
  }

  transformInputToFloat(total: any) {
    let totalValue = total.target.value;
    let totalValueString = total.target.value.toString();

    if (totalValue.length === 0) {
      let val: number = Number.parseFloat('0.0');
      this.formattedTotal = val.toFixed(2);
      total.target.value = this.formattedTotal;
    } else {
      if (isNaN(totalValue[0])) {
        let totalValueNormalized = '';
        for (let i = 0; i < totalValue.length; i++) {
          if (!isNaN(totalValue[i])) {
            totalValueNormalized += totalValue[i];
          }
        }
        if (totalValueNormalized.length > 0) {
          const splitter = (index: number, str: string) => [
            str.slice(0, index),
            str.slice(index),
          ];
          let splittedValue = splitter(
            totalValueNormalized.length - 2,
            totalValueNormalized
          );
          let value = splittedValue[0] + '.' + splittedValue[1];
          let valueFloat: number = Number.parseFloat(value);
          this.formattedTotal = valueFloat.toFixed(2);
          total.target.value = this.formattedTotal;
        } else {
          let val: number = Number.parseFloat('0.0');
          this.formattedTotal = val.toFixed(2);
          total.target.value = this.formattedTotal;
        }
      } else {
        if (this.isFloat(totalValue)) {
          let parsedTotal = parseFloat(totalValue);
          this.formattedTotal = parsedTotal.toFixed(2);
          total.target.value = this.formattedTotal;
        } else if (totalValueString.length > 2) {
          if (!isNaN(totalValueString)) {
            const splitter = (index: number, str: string) => [
              str.slice(0, index),
              str.slice(index),
            ];
            let splittedValue = splitter(
              totalValueString.length - 2,
              totalValueString
            );
            let value = splittedValue[0] + '.' + splittedValue[1];
            let valueFloat: number = Number.parseFloat(value);
            this.formattedTotal = valueFloat.toFixed(2);
            total.target.value = this.formattedTotal;
          } else {
            let totalValueNormalized = '';
            for (let i = 0; i < totalValueString.length; i++) {
              if (!isNaN(totalValueString[i])) {
                totalValueNormalized += totalValueString[i];
              }
            }
            const splitter = (index: number, str: string) => [
              str.slice(0, index),
              str.slice(index),
            ];
            let splittedValue = splitter(
              totalValueNormalized.length - 2,
              totalValueNormalized
            );
            let value = splittedValue[0] + '.' + splittedValue[1];
            let valueFloat: number = Number.parseFloat(value);
            this.formattedTotal = valueFloat.toFixed(2);
            total.target.value = this.formattedTotal;
          }
        } else {
          totalValueString += '.0';
          let totalValueNormalized = parseFloat(totalValueString).toFixed(2);
          this.formattedTotal = totalValueNormalized;
          total.target.value = this.formattedTotal;
        }
      }
    }
  }

  isFloat(total: any) {
    let parsed = parseFloat(total);
    return typeof parsed === 'number' && parsed % 1 !== 0;
  }

  async applyChanges() {
    try {
      await this.api.setDefaultValues(this.currentDefaultValues);
      await this.ngOnInit();
      this.snackBar.open('Standardwerte erfolgreich gesetzt!', 'OK', {
        duration: 3000,
        panelClass: 'success-snackbar',
      });
    } catch (error) {
      this.snackBar.open(
        'Standardwerte koknneten nicht gespreichert werden.',
        'OK',
        {
          duration: 3000,
          panelClass: 'success-snackbar',
        }
      );
    }
    this.closeDialog();
  }

  closeDialog() {
    this.dialog.close();
  }
}
