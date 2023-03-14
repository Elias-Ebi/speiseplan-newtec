import { Component, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MatTableModule,
  MatTableDataSource,
  _MatTableDataSource,
} from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { Profile } from '../../shared/models/profile';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from 'src/app/shared/services/auth.service';
import { MatTabsModule } from '@angular/material/tabs';

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
    MatTabsModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  displayedData: string[] = ['name', 'email', 'aktion'];
  adminDataSource: MatTableDataSource<Profile>;
  nonAdminDataSource: MatTableDataSource<Profile>;
  admins: Profile[];
  nonAdmins: Profile[];
  selectedTabIndex: number;
  searchValue: string;

  // @ts-ignore
  @ViewChild('adminPaginator') adminPaginator: MatPaginator;
  // @ts-ignore
  @ViewChild('nonAdminPaginator') nonAdminPaginator: MatPaginator;
  // @ts-ignore
  @ViewChild('adminSort') adminSort: MatSort;
  // @ts-ignore
  @ViewChild('nonAdminSort') nonAdminSort: MatSort;

  constructor(public matDialog: MatDialog, private authService: AuthService) {
    this.admins = [];
    this.nonAdmins = [];
    this.adminDataSource = new MatTableDataSource(this.admins);
    this.nonAdminDataSource = new MatTableDataSource(this.nonAdmins);
    this.selectedTabIndex = 0;
    this.searchValue = '';
  }

  async ngOnInit() {
    await this.updateTableSource();
  }

  applySearch() {
    if (this.selectedTabIndex === 0) {
      this.adminDataSource.filter = this.searchValue.trim().toLowerCase();
      if (this.adminPaginator) {
        this.adminPaginator.firstPage();
      }
    } else {
      this.nonAdminDataSource.filter = this.searchValue.trim().toLowerCase();

      if (this.nonAdminPaginator) {
        this.nonAdminPaginator.firstPage();
      }
    }
  }

  async toggleAdminAccess(userEmail: string) {
    await this.authService.toggleAdminAccess(userEmail);
    this.updateTableSource();
  }

  deleteUser() {
    //TODO: Verhalten definieren, wenn Nutzer aus Anwendung entfernt werden:
    /*
     * Welche Daten sollen entfernt werden/ erhalten bleiben, wenn ein User/Profile gelöscht wird?
     * Sollen die Konten überhaupt gelöscht werden oder nur deaktiviert werden?
     */
  }

  onTabChange() {
    this.searchValue = '';
    this.adminDataSource.filter = '';
    this.nonAdminDataSource.filter = '';
  }

  async updateTableSource() {
    this.admins = await this.authService.getAllAdminProfiles();
    this.nonAdmins = await this.authService.getAllNonAdminProfiles();
    this.adminDataSource = new MatTableDataSource(this.admins);
    this.adminDataSource.paginator = this.adminPaginator;

    this.nonAdminDataSource = new MatTableDataSource(this.nonAdmins);
    this.nonAdminDataSource.paginator = this.nonAdminPaginator;
  }
}
