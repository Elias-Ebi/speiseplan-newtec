import { Component, OnInit } from '@angular/core';
import { UserNavigationComponent } from "./user/shared/components/navigation/user-navigation.component";
import { RouterOutlet } from "@angular/router";
import { AuthService } from "./shared/services/auth.service";


@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    UserNavigationComponent,
    RouterOutlet
  ],
  styleUrls: ['./app.component.scss'],
  
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.getAndSetProfile();
  }
}
