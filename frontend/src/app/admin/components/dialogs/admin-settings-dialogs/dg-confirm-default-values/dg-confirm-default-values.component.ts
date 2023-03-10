import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { Temporal } from '@js-temporal/polyfill';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/shared/services/api.service';
import { DefaultValues } from 'src/app/shared/models/defaultvalues';

@Component({
  selector: 'app-confirm-default-values',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, MatSnackBarModule],
  templateUrl: './dg-confirm-default-values.component.html',
  styleUrls: ['./dg-confirm-default-values.component.scss']
})
export class DgConfirmDefaultValuesComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {before: DefaultValues, after: DefaultValues},
    private dialogRef: MatDialogRef<DgConfirmDefaultValuesComponent>,
    private snackBar: MatSnackBar,
    private api: ApiService
  ) { }

  closeDialog(isConfirmed: boolean) {
    this.dialogRef.close(
      {isConfirmed: isConfirmed}
    );
  }
}
