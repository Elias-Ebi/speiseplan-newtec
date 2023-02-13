import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private duration = 2000;

  constructor(private snackBar: MatSnackBar) { }

  success(message: string) {
    this.snackBar.open(message, '', {
      duration: this.duration,
      panelClass: 'success-snackbar'
    });
  }

  error(message: string) {
    this.snackBar.open(message, '', {
      duration: this.duration
    });
  }
}
