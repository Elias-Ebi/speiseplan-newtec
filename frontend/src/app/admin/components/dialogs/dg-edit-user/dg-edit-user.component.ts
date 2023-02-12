import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  FormGroup,
  FormsModule,
  FormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dg-edit-user',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dg-edit-user.component.html',
  styleUrls: ['./dg-edit-user.component.scss'],
})
export class DgEditUserComponent implements OnInit {
  userForm!: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private matDialogRef: MatDialogRef<DgEditUserComponent>,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      name: [''],
      email: [''],
      isAdmin: [''],
    });

    if (this.data) {
      this.userForm.controls['name'].setValue(this.data.name);
      this.userForm.controls['email'].setValue(this.data.email);
      this.userForm.controls['isAdmin'].setValue(this.data.isAdmin);
    }
  }

  onClickCancel() {
    this.matDialogRef.close();
  }

  onClickUpdate() {
    this.matDialogRef.close({
      name: this.userForm.value.name,
      email: this.userForm.value.email,
      isAdmin: this.userForm.value.isAdmin,
      oldEmail: this.data.email,
    });
  }
}
