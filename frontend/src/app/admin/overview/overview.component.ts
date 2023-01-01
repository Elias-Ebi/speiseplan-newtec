import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { EuroPipe} from "../../shared/pipes/euro.pipe";
import { WeekdayNamePipe} from "../../shared/pipes/weekday-name.pipe";
import { MatTabsModule} from "@angular/material/tabs";
import {Temporal} from "@js-temporal/polyfill";
import {MatButtonModule} from "@angular/material/button";
import {MatExpansionModule} from "@angular/material/expansion";


@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTabsModule, EuroPipe, WeekdayNamePipe, MatButtonModule, MatExpansionModule],
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent {

  users = [ {user:"Max Mustermann"}, {user:"Grace Kelly"}, {user:"Birgit Beispiel"}, {user:"Bernhard-Viktor Christoph-Carl von Bülow"} ]

  orders = [
    {
      meals: ["Fleischküchle"],
      total: 9,
      users: this.users
    },
    {
      meals: ["Bratlinge"],
      total: 8,
      users: this.users
    },
    {
      meals: ["Salat Sizilia"],
      total: 11,
      users: this.users
    }
  ]

  dayData = [
    {
      date: Temporal.PlainDate.from("2022-10-21"),
      orders: this.orders
    },
    {
      date: Temporal.PlainDate.from("2022-10-24"),
      orders: this.orders
    },
    {
      date: Temporal.PlainDate.from("2022-10-25"),
      orders: this.orders
    },
    {
      date: Temporal.PlainDate.from("2022-10-26"),
      orders: this.orders
    },
    {
      date: Temporal.PlainDate.from("2022-10-27"),
      orders: this.orders
    }
  ]

}
