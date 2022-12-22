import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {AddUserDialogComponent} from "./add-user-dialog/add-user-dialog.component";
import {EditUserDialogComponent} from "./edit-user-dialog/edit-user-dialog.component";
import {DeleteUserDialogComponent} from "./delete-user-dialog/delete-user-dialog.component";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, MatButtonModule, MatInputModule, MatPaginatorModule, MatCheckboxModule, MatDialogModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

  username: string | undefined;
  email: string | undefined;
  isAdmin: boolean | undefined;
  removeUser: boolean | undefined;

  constructor(public matDialog: MatDialog) {
  }

  onClickAddUser(): void {
    const dialogRef = this.matDialog.open(AddUserDialogComponent, {
      data: {
        username: this.username,
        email: this.email,
        isAdmin: this.isAdmin
      },
      disableClose: true,
      width: "26rem",
      height: "22rem"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.username = result.username;
      this.email = result.email;
      this.isAdmin = result.isAdmin;
    });
  }

  onClickEditUser(): void {
    const dialogRef = this.matDialog.open(EditUserDialogComponent, {
      data: {
        username: this.username,
        email: this.email,
        isAdmin: this.isAdmin
      },
      disableClose: true,
      width: "26rem",
      height: "22rem"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.username = result.username;
      this.email = result.email;
      this.isAdmin = result.isAdmin;
    });
  }

  onClickDeleteUser(): void {
    const dialogRef = this.matDialog.open(DeleteUserDialogComponent, {
      data: {
        removeUser: this.removeUser
      },
      disableClose: true,
      width: "24rem",
      height: "16rem"
    });

    dialogRef.afterClosed().subscribe(result => {
      this.removeUser = result.removeUser;
    });
  }
}
