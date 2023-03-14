import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Profile } from '../../shared/models/profile';
import { ApiService } from "../../shared/services/api.service";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { sortByString } from "../../user/shared/utils";
import { AddAdminDialogComponent } from "./add-admin-dialog/add-admin-dialog.component";
import { lastValueFrom } from "rxjs";
import { DeleteAdminDialogComponent } from "./delete-admin-dialog/delete-admin-dialog.component";

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLink,
    MatButtonModule,
    MatInputModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatDialogModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss'],
})
export class AdminManagementComponent implements OnInit {
  admins: Profile[] = [];

  constructor(private apiService: ApiService, private snackbarService: SnackbarService, private dialog: MatDialog) {
  }

  async ngOnInit() {
    const profiles = await this.apiService.getAllAdminProfiles();
    this.admins = profiles.sort((a, b) => sortByString(a.email, b.email));
  }

  async add() {
    const dialogRef = this.dialog.open(AddAdminDialogComponent, {autoFocus: false});
    await lastValueFrom(dialogRef.afterClosed()).then((admin: Profile) => {
      if (!admin) {
        return;
      }
      const newAdmins = [...this.admins, admin];
      this.admins = newAdmins.sort((a, b) => sortByString(a.email, b.email));
    });
  }

  async delete(admin: Profile) {
    if (this.admins.length === 1) {
      this.snackbarService.error("Can not delete last Admin of the system!");
      return;
    }

    const dialogRef = this.dialog.open(DeleteAdminDialogComponent, {data: admin, autoFocus: false});
    await lastValueFrom(dialogRef.afterClosed())
      .then((email) => {
        if (!email) {
          return;
        }

        this.admins = this.admins.filter((admin) => admin.email !== email);
      });
  }
}
