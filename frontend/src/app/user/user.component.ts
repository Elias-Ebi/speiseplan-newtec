import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserNavigationComponent } from "./shared/components/navigation/user-navigation.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, UserNavigationComponent, RouterOutlet],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

}
