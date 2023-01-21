import { Component, OnInit, Optional } from '@angular/core';
import { UserNavigationComponent } from "./user/shared/components/navigation/user-navigation.component";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./shared/services/auth.service";
import {
  LoadingSpinnerDialogComponent
} from "./shared/components/loading-spinner-dialog/loading-spinner-dialog.component";
import { MatDialog, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { LoadingService } from "./shared/services/loading.service";

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    UserNavigationComponent,
    RouterOutlet,
    MatDialogModule
  ],
  styleUrls: ['./app.component.scss'],

})
export class AppComponent implements OnInit {
  private loadingInstances = 0;

  constructor(private authService: AuthService, private loadingService: LoadingService, private dialog: MatDialog, @Optional() private dialogRef: MatDialogRef<LoadingSpinnerDialogComponent>) {
    this.authService.getAndSetProfile();
  }

  async ngOnInit(): Promise<void> {
    this.loadingService.loading$.subscribe((loading) => {
      if (loading) {
        this.loadingInstances++;

        if (this.loadingInstances === 1) {
          this.dialogRef = this.dialog.open(LoadingSpinnerDialogComponent, {
            disableClose: true,
            panelClass: 'spinner-dialog'
          })
        }
      } else {
        this.loadingInstances--;

        if (!this.loadingInstances) {
          this.dialogRef.close();
        }
      }
    });
  }
}
