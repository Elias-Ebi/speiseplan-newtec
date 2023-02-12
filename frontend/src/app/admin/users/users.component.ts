import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DgAddUserComponent } from '../components/dialogs/dg-add-user/dg-add-user.component';
import { DgEditUserComponent } from '../components/dialogs/dg-edit-user/dg-edit-user.component';
import { DgDeleteUserComponent } from '../components/dialogs/dg-delete-user/dg-delete-user.component';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Profile } from '../../shared/models/profile';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-users',
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
    MatTooltipModule,
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements AfterViewInit {
  displayedData: string[] = ['name', 'email', 'isAdmin', 'aktion'];
  dataSource: MatTableDataSource<Profile>;
  users: Profile[];

  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;

  constructor(public matDialog: MatDialog) {
    this.users = [
      { name: 'Test 1', email: 'test.1@email.de', isAdmin: false },
      { name: 'Test 2', email: 'test.2@email.de', isAdmin: true },
      { name: 'Test 3', email: 'test.3@email.de', isAdmin: false },
    ];

    this.dataSource = new MatTableDataSource(this.users);
  }

  onClickAddUser(): void {
    const dialogRef = this.matDialog.open(DgAddUserComponent, {
      data: {},
      disableClose: true,
      width: '26rem',
      height: '22rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.users.push({
        name: result.name,
        email: result.email,
        isAdmin: result.isAdmin,
      });
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onClickEditUser(row: any): void {
    const dialogRef = this.matDialog.open(DgEditUserComponent, {
      data: row,
      disableClose: true,
      width: '26rem',
      height: '22rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      let temp: Profile[] = [];
      this.users.forEach((u) => {
        if (u.email !== result.oldEmail) {
          temp.push(u);
        }
      });
      this.users = temp;
      this.users.push({
        name: result.name,
        email: result.email,
        isAdmin: result.isAdmin,
      });
      this.users.sort((a, b) => {
        if (a.email > b.email) {
          return 1;
        } else {
          return -1;
        }
      });
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  onClickDeleteUser(row: any): void {
    const dialogRef = this.matDialog.open(DgDeleteUserComponent, {
      data: row,
      disableClose: true,
      width: '24rem',
      height: '16rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      let temp: Profile[] = [];
      this.users.forEach((u) => {
        if (u.email !== result.email) {
          temp.push(u);
        }
      });
      this.users = temp;
      this.users.sort();
      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applySearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = searchValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  public getUsers(): Profile[] {
    return this.users;
  }
}
