import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-delete-dish-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatInputModule],
  templateUrl: './delete-meal-dialog.component.html',
  styleUrls: ['./delete-meal-dialog.component.scss']
})
export class DeleteMealDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      name: string,
      id: string,
    },
    private dialogRef: MatDialogRef<DeleteMealDialogComponent>
  ) {
  }

  closeDialog(isDeletingDishConfirmed: boolean) {
    this.dialogRef.close(
      {isDeletingDishConfirmed: isDeletingDishConfirmed}
    );
  }
}
