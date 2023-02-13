import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Temporal } from '@js-temporal/polyfill';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Order } from 'src/app/shared/models/order';
import { DateAdapter } from "@angular/material/core";
import { ApiService } from 'src/app/shared/services/api.service';

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
  styleUrls: ['./edit-order-dialog.component.scss'],
})
export class EditOrderDialogComponent {
  temporal = Temporal
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public order: Order,
    private dialogRef: MatDialogRef<EditOrderDialogComponent>,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<any>,
    private apiService: ApiService,
  ) {
    this.dateAdapter.setLocale('de');
  }

  async closeDialog(isEditConfirmed: boolean) {
    if (isEditConfirmed) {
      try {
        if(typeof this.order.date === 'object'){
        let tmp = this.order.date as unknown as Date;
        let month = (tmp.getMonth()+1).toString().padStart(2, '0');
        let day = tmp.getDate().toString().padStart(2, '0');
        this.order.date = tmp.getFullYear() + '-' + month + '-' + day
      }
        const res = await this.apiService.updateOrder(this.order);
        
    } catch (e) {
      console.error(e);
    }
    
    this.snackBar.open("Bestellung erfolgreich bearbeitet!", "OK", {
      duration: 3000,
      panelClass: 'success-snackbar'
    })
  }
  this.dialogRef.close();
}


}
