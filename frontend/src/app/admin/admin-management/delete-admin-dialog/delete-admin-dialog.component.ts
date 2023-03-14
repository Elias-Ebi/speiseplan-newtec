import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Profile } from "../../../shared/models/profile";
import { ApiService } from "../../../shared/services/api.service";

@Component({
  selector: 'app-delete-admin-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './delete-admin-dialog.component.html',
  styleUrls: ['./delete-admin-dialog.component.scss']
})
export class DeleteAdminDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public admin: Profile,
    private dialogRef: MatDialogRef<DeleteAdminDialogComponent>,
    private apiService: ApiService
  ) {
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async delete(email: string) {
    await this.apiService.toggleAdminAccess(email);
    this.dialogRef.close(email);
  }
}
