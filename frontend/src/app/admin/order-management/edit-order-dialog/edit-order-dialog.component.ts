import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {MatInputModule} from '@angular/material/input'; 
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { Temporal } from '@js-temporal/polyfill';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatDatepickerModule} from '@angular/material/datepicker'; 

@Component({
  selector: 'app-edit-order-dialog',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatSnackBarModule, 
    MatButtonModule, 
    MatInputModule, 
    FormsModule, 
    ReactiveFormsModule,
    MatDatepickerModule
  ],
  templateUrl: './edit-order-dialog.component.html',
  styleUrls: ['./edit-order-dialog.component.scss']
})
export class EditOrderDialogComponent {
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
    private dialogRef: MatDialogRef<EditOrderDialogComponent>,
    private snackBar: MatSnackBar
    ) {
  }

  closeDialog(isEditConfirmed: boolean) {
    if(isEditConfirmed) {
      //TODO: cancel order
      this.snackBar.open("Bestellung erfolgreich bearbeitet!", "OK", {
        duration: 3000,
        panelClass: 'success-snackbar'
      })
    }
    this.dialogRef.close();
  }
}
