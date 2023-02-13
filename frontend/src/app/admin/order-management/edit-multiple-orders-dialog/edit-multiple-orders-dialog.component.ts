import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Temporal } from '@js-temporal/polyfill';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Order } from 'src/app/shared/models/order';
import { DateAdapter } from "@angular/material/core";
import { ApiService } from 'src/app/shared/services/api.service';

@Component({
  selector: 'app-edit-multiple-orders-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatSnackBarModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatCheckboxModule
  ],
  templateUrl: './edit-multiple-orders-dialog.component.html',
  styleUrls: ['./edit-multiple-orders-dialog.component.scss'],
})
export class EditMultipleOrdersDialogComponent {
  temporal = Temporal

  toUpdate = {
    updateName: false,
    updateGuestName: false,
    updateMeal: false,
    updateDate: false,
  }


  changes = {
    overwriteName: null,
    overwriteGuestName: null,
    overwriteMeal: null,
    overwriteDate: null,
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public orders: Order[],
    private dialogRef: MatDialogRef<EditMultipleOrdersDialogComponent>,
    private snackBar: MatSnackBar,
    private dateAdapter: DateAdapter<any>,
    private apiService: ApiService,
  ) {
    this.dateAdapter.setLocale('de');
  }

  async closeDialog(isEditConfirmed: boolean) {
    if (isEditConfirmed) {
      try {
        if(this.toUpdate.updateName || this.toUpdate.updateGuestName || this.toUpdate.updateMeal || this.toUpdate.updateDate){
          let changesToSend:any = {};

          if(this.toUpdate.updateDate){
           
          !this.changes.overwriteDate? changesToSend.overwriteDate = '' : changesToSend.overwriteDate = this.changes.overwriteDate
           /*
            let tmp = changesToSend.overwriteDate as unknown as Date;
            let month = (tmp.getMonth()+1).toString().padStart(2, '0');
            let day = tmp.getDate().toString().padStart(2, '0');;
            changesToSend.overwriteDate = tmp.getFullYear() + '-' + month + '-' + day
            */
          }

          if(this.toUpdate.updateName){
            !this.changes.overwriteName? changesToSend.overwriteName = '' : changesToSend.overwriteName = this.changes.overwriteName
          }

          if(this.toUpdate.updateGuestName){
            !this.changes.overwriteGuestName? changesToSend.overwriteGuestName = '' : changesToSend.overwriteGuestName = this.changes.overwriteGuestName
          }

          if(this.toUpdate.updateMeal){
            !this.changes.overwriteMeal? changesToSend.overwriteMeal = '' : changesToSend.overwriteMeal = this.changes.overwriteMeal
          }

          const res = await this.apiService.updateMultipleOrders(this.orders, changesToSend);
        }
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

  editDateFields(checked: boolean){
    this.toUpdate.updateDate = checked;
    if (!checked){
      this.changes.overwriteDate = null;
    } 
  }
  editNameFields(checked: boolean){
    this.toUpdate.updateName = checked;
    if (!checked){
      this.changes.overwriteName = null;
    }
  }
  editGuestNameFields(checked: boolean){
    this.toUpdate.updateGuestName = checked;
    if (!checked){
      this.changes.overwriteGuestName = null;
    }
  }
  editMealFields(checked: boolean){
    this.toUpdate.updateMeal = checked;
    if (!checked){
      this.changes.overwriteMeal = null;
    }
  }
  
}
