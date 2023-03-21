import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogRef} from "@angular/material/dialog";
import {ApiService} from "../../../../../shared/services/api.service";
import {SnackbarService} from "../../../../../shared/services/snackbar.service";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {map, Observable, startWith} from "rxjs";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-change-password-dialog',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, FormsModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent {
  newPwsUnequal$: Observable<boolean>;
  buttonDisabled$: Observable<boolean>;
  pwsEqual$: Observable<boolean>;
  hidePws = [true, true, true];

  form = this.initializeForm();

  constructor(
    private dialogRef: MatDialogRef<ChangePasswordDialogComponent>,
    private apiService: ApiService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ) {
    this.newPwsUnequal$ = this.form.valueChanges.pipe(
      map((value) => value.new1 !== value.new2)
    );

    this.buttonDisabled$ = this.form.valueChanges.pipe(
      startWith(true),
      map((value) => {
        const newPwsUnequal = value.new1 !== value.new2;
        const pwEqual = value.current === value.new1;
        return !value.current || !value.new1 || !value.new2 || newPwsUnequal || pwEqual;
      })
    );

    this.pwsEqual$ = this.form.valueChanges.pipe(
      map((value) => value.current && value.current === value.new1)
    )

  }

  closeDialog() {
    this.dialogRef.close();
  }

  async changePassword() {
    const value = this.form.value;
    await this.apiService.changePassword(value.current, value.new1)
      .then(() => {
        this.snackbarService.success("Passwort erfolgreich geändert");
      })
      .catch(() => {
        this.snackbarService.error("Passwort konnte nicht geändert werden");
      });

    this.closeDialog();
  }

  toggleHide(index: number) {
    this.hidePws[index] = !this.hidePws[index];
  }

  getVisibilityIcon(index: number): string {
    return this.hidePws[index] ? 'visibility' : 'visibility_off';
  }

  getInputType(index: number): string {
    return this.hidePws[index] ? 'password' : 'text';
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      current: [''],
      new1: [''],
      new2: ['']
    })
  }

}
