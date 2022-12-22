import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";

@Component({
  selector: 'app-bandit-plate-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './bandit-plate-dialog.component.html',
  styleUrls: ['./bandit-plate-dialog.component.scss']
})
export class BanditPlateDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public banditPlates: [{ name: string, description: string }], private dialogRef: MatDialogRef<BanditPlateDialogComponent>) {
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
