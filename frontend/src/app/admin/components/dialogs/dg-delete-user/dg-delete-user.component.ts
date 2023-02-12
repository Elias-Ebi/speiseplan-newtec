import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dg-delete-user',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, MatButtonModule],
  templateUrl: './dg-delete-user.component.html',
  styleUrls: ['./dg-delete-user.component.scss'],
})
export class DgDeleteUserComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly data: { name: string; email: string; isAdmin: boolean },
    private matDialogRef: MatDialogRef<DgDeleteUserComponent>
  ) {}

  onClickCancel() {
    this.matDialogRef.close();
  }

  onClickApply() {
    this.matDialogRef.close(this.data);
  }
}
