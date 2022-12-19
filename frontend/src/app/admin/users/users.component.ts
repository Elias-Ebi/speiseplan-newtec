import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { RouterLink } from "@angular/router";
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from "@angular/material/input";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatCheckboxModule} from "@angular/material/checkbox";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLink, MatButtonModule, MatInputModule, MatPaginatorModule, MatCheckboxModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {

}
