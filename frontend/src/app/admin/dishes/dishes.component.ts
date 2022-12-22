import { Component } from '@angular/core';
import {Temporal} from "@js-temporal/polyfill";
import {MonthNamePipe} from "../../shared/pipes/month-name.pipe";
import {JsonPipe} from "@angular/common";
import {WeekdayNamePipe} from "../../shared/pipes/weekday-name.pipe";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-dishes',
  standalone: true,
  templateUrl: './dishes.component.html',
  imports: [
    MonthNamePipe,
    JsonPipe,
    WeekdayNamePipe,
    MatIconModule
  ],
  styleUrls: ['./dishes.component.scss']
})
export class DishesComponent {
  date = Temporal.Now.plainDateISO();
}
