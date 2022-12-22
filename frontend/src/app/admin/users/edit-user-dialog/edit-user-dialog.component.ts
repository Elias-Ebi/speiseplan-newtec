import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {FormsModule} from "@angular/forms";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-edit-user-dialog',
  standalone: true,
  templateUrl: './edit-user-dialog.component.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  styleUrls: ['./edit-user-dialog.component.scss']
})
export class EditUserDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: {username: string, email: string, isAdmin: boolean }, private matDialogRef: MatDialogRef<EditUserDialogComponent>) {

  }
  onClickCancel() {
    this.matDialogRef.close(this.data);
  }
}
