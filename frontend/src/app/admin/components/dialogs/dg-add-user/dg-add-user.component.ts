import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dg-add-user',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dg-add-user.component.html',
  styleUrls: ['./dg-add-user.component.scss'],
})
export class DgAddUserComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    readonly data: { name: string; email: string; isAdmin: boolean },
    private matDialogRef: MatDialogRef<DgAddUserComponent>
  ) {}

  onClickAdd() {
    this.matDialogRef.close(this.data);
  }
  onClickCancel() {
    this.matDialogRef.close();
  }
}
