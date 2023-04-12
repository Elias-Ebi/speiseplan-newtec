import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogRef } from "@angular/material/dialog";
import { Profile } from "../../../shared/models/profile";
import { ApiService } from "../../../shared/services/api.service";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { sortByString } from "../../../user/shared/utils";
import { map, Observable, startWith } from "rxjs";
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-admin-dialog',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './add-admin-dialog.component.html',
  styleUrls: ['./add-admin-dialog.component.scss']
})
export class AddAdminDialogComponent implements OnInit {
  inputControl = new FormControl('');
  users: Profile[] = [];
  filteredUsers$: Observable<Profile[]> = new Observable<Profile[]>();
  invalidInput$: Observable<boolean> = new Observable<boolean>();

  constructor(private dialogRef: MatDialogRef<AddAdminDialogComponent>, private apiService: ApiService) {
  }

  async ngOnInit(): Promise<void> {
    const users = await this.apiService.getAllNonAdminProfiles();
    this.users = users.sort((a, b) => sortByString(a.email, b.email));

    this.filteredUsers$ = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this.filterUsers(value || ''))
    )

    this.invalidInput$ = this.inputControl.valueChanges.pipe(
      startWith(''),
      map(value => this.validateInput(value || ''))
    )
  }

  resetInput(input: any) {
    input.value = '';
    this.inputControl.setValue('');
  }

  validateInput(value: string): boolean {
    return !this.users.find((profile) => profile.email === value);
  }

  closeDialog() {
    this.dialogRef.close();
  }

  async add() {
    const email = this.inputControl.value as string;
    const profile = await this.apiService.toggleAdminAccess(email);
    this.dialogRef.close(profile);
  }

  private filterUsers(value: string): Profile[] {
    const filterValue = value.toLowerCase();
    return this.users.filter((user) => user.email.toLowerCase().includes(filterValue));
  }
}
