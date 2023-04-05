import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-icon-snackbar',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './icon-snackbar.component.html',
  styleUrls: ['./icon-snackbar.component.scss']
})
export class IconSnackbarComponent {
  constructor(
    @Inject(MAT_SNACK_BAR_DATA) public snackData: any
  ) {}

  getIcon() {
    switch (this.snackData.snackType) {
      case 'Success':
        return 'done';
      case 'Error':
        return 'error';
      case 'Warn':
        return 'warning';
      case 'Info':
        return 'info';
      default:
        return 'success';
    }
  }
}
