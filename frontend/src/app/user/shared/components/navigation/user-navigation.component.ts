import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import { Observable } from "rxjs";

@Component({
  selector: 'app-user-navigation',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink],
  templateUrl: './user-navigation.component.html',
  styleUrls: ['./user-navigation.component.scss']
})
export class UserNavigationComponent {
  isAdmin$: Observable<boolean>;

  constructor(private authService: AuthService) {
    this.isAdmin$ = this.authService.isAdmin$;
  }

  logout() {
    this.authService.logout();
  }
}
