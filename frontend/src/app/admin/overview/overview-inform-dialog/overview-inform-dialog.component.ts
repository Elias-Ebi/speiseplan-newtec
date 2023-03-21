import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatSelectModule} from "@angular/material/select";
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Meal} from "../../../shared/models/meal";
import {Profile} from "../../../shared/models/profile";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {Order} from "../../../shared/models/order";

@Component({
  selector: 'app-overview-inform-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule, MatSnackBarModule, MatSelectModule, ReactiveFormsModule, FormsModule, MatCheckboxModule],
  templateUrl: './overview-inform-dialog.component.html',
  styleUrls: ['./overview-inform-dialog.component.scss']
})
export class OverviewInformDialogComponent {
  userSelection= new FormControl<Order[]>([]);
  allSelected = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      meals: Order[]
    },
    private dialogRef: MatDialogRef<OverviewInformDialogComponent>
  ) {
    this.selectAll();
  }

  selectAll(){
    this.allSelected = !this.allSelected;
    const selectedUsers = this.allSelected ? this.data.meals.map(user => user) : [];
    this.userSelection.setValue(selectedUsers);
  }

  closeDialog(isConfirmed: boolean) {
    this.dialogRef.close(
      {sendMessage: isConfirmed, selectedUsers: this.userSelection.value}
    );
  }
}
