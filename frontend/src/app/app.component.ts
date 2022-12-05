import { Component } from '@angular/core';
import { NavigationComponent } from "./shared/components/navigation/navigation.component";
import { RouterOutlet } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    NavigationComponent,
    RouterOutlet
  ],
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
}
