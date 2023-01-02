import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {MatInputModule} from '@angular/material/input'; 
import { Temporal } from '@js-temporal/polyfill';
import {MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cancel-order-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, MatSnackBarModule ],
  templateUrl: './cancel-order-dialog.component.html',
  styleUrls: ['./cancel-order-dialog.component.scss']
})
export class CancelOrderDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) 
    public order: 
      { 
        date: Temporal.PlainDate, 
        buyer: string,
        meals: string,
        guest: string, 
      }
    , 
    private dialogRef: MatDialogRef<CancelOrderDialogComponent>,
    private snackBar: MatSnackBar
    ) {
  }

  closeDialog(isCancelingOrderConfirmed: boolean) {
    if(isCancelingOrderConfirmed) {
      //TODO: cancel order
      this.snackBar.open("Bestellung erfolgreich storniert!", "OK", {
        duration: 3000,
        panelClass: 'success-snackbar'
      })
    }
    this.dialogRef.close();
  }
}
