import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatInputModule} from "@angular/material/input";
import {MatDialogRef} from "@angular/material/dialog";
import {AuthService} from "../../../../../shared/services/auth.service";
import {firstValueFrom} from "rxjs";
import {MatButtonModule} from "@angular/material/button";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../../../../../shared/services/api.service";
import {SnackbarService} from "../../../../../shared/services/snackbar.service";

@Component({
  selector: 'app-change-name-dialog',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './change-name-dialog.component.html',
  styleUrls: ['./change-name-dialog.component.scss']
})
export class ChangeNameDialogComponent implements OnInit {
  name: string = '';

  constructor(
    private dialogRef: MatDialogRef<ChangeNameDialogComponent>,
    private authService: AuthService,
    private apiService: ApiService,
    private snackbarService: SnackbarService
  ) {

  }

  closeDialog() {
    this.dialogRef.close();
  }

  async ngOnInit(): Promise<void> {
    const profile = await firstValueFrom(this.authService.profile$);
    this.name = profile.name;
  }

  async changeName() {
    await this.apiService.changeName(this.name)
      .then((profile) => {
        this.snackbarService.success("Name erfolgreich geändert");
        this.authService.setProfile(profile);
      })
      .catch(() => {
        this.snackbarService.error("Name konnte nicht geändert werden");
      });

    this.closeDialog();
  }
}
