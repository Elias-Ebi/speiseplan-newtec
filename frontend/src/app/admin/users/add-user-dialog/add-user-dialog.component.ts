import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'add-user-dialog',
  standalone: true,
  templateUrl: './add-user-dialog.component.html',
  imports: [
    MatDialogModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  styleUrls: ['./add-user-dialog.component.scss']
})
export class AddUserDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: {username: string, email: string, isAdmin: boolean }, private matDialogRef: MatDialogRef<AddUserDialogComponent>) {

  }
  onClickCancel() {
    this.matDialogRef.close(this.data);
  }
}
