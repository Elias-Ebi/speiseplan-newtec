import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IconSnackbarComponent } from '../components/icon-snackbar/icon-snackbar.component';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private duration = 2000;

  constructor(private snackBar: MatSnackBar) {
  }

  success(message: string) {
    const snackType = 'Success';
    this.snackBar.openFromComponent(IconSnackbarComponent, {
      duration: this.duration,
      data: { message, snackType },
      panelClass: 'success-snackbar'
    });
  }

  error(message: string) {
    const snackType = 'Error';
    this.snackBar.openFromComponent(IconSnackbarComponent, {
      duration: this.duration,
      data: { message, snackType },
      //panelClass: 'error-snackbar'
    });
  }
}
