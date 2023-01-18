import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-loading-spinner-dialog',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loading-spinner-dialog.component.html',
  styleUrls: ['./loading-spinner-dialog.component.scss']
})
export class LoadingSpinnerDialogComponent {

}
