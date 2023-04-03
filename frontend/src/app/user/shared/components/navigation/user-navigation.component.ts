import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from "@angular/material/icon";
import {Router, RouterLink, RouterLinkActive} from "@angular/router";
import {AuthService} from "../../../../shared/services/auth.service";
import {Observable} from "rxjs";
import {StateService} from "../../../../shared/services/state.service";
import {MatMenuModule} from "@angular/material/menu";
import {MatDialog} from "@angular/material/dialog";
import {ChangeNameDialogComponent} from "./change-name-dialog/change-name-dialog.component";
import {ChangePasswordDialogComponent} from "./change-password-dialog/change-password-dialog.component";

@Component({
  selector: 'app-user-navigation',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, MatMenuModule, RouterLinkActive],
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.scss']
})
export class UserNavigationComponent {
  isActive: boolean = false;
  isAdmin$: Observable<boolean>;

  constructor(private authService: AuthService, private router: Router, private stateService: StateService, private dialog: MatDialog) {
    this.isAdmin$ = this.authService.isAdmin$;
  }

  logout() {
    this.authService.logout();
  }

  navigateToOrderPage() {
    this.stateService.setSelectedOrderDate(null);
    this.router.navigateByUrl('/bestellen');
    this.isActive = true;
  }

  changeName() {
    this.dialog.open(ChangeNameDialogComponent, {autoFocus: false});
  }

  changePassword() {
    this.dialog.open(ChangePasswordDialogComponent, {autoFocus: false});
  }

}
