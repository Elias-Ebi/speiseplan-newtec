import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";

@Component({
  selector: 'app-delete-user-dialog',
  standalone: true,
  templateUrl: './delete-user-dialog.component.html',
  imports: [
    MatDialogModule,
    MatIconModule,
    MatButtonModule
  ],
  styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) readonly data: {username: string, email: string, isAdmin: boolean }, private matDialogRef: MatDialogRef<DeleteUserDialogComponent>) {}
  onClickCancel() {
    this.matDialogRef.close(this.data);
  }
}
