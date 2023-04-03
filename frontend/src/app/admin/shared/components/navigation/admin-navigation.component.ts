import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from "../../../../shared/services/auth.service";
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

interface NavItem {
  name: string;
  id: number;
}

@Component({
  selector: 'app-admin-navigation',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, MatButtonModule, RouterLinkActive, MatMenuModule],
  templateUrl: './admin-navigation.component.html',
  styleUrls: ['./admin-navigation.component.scss']
})
export class AdminNavigationComponent {
  constructor(private authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }
}
