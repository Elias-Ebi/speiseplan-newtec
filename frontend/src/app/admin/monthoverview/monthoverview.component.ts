import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { EuroPipe } from "../../shared/pipes/euro.pipe";
import { Temporal } from "@js-temporal/polyfill";
import { WeekdayNamePipe } from "../../shared/pipes/weekday-name.pipe";
import { MatTabsModule } from "@angular/material/tabs";
import { MonthNamePipe } from "../../shared/pipes/month-name.pipe";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-monthoverview',
  standalone: true,
  imports: [CommonModule, MatIconModule, EuroPipe, WeekdayNamePipe, MatTabsModule, MonthNamePipe, MatButtonModule, MatInputModule, FormsModule],
  templateUrl: './monthoverview.component.html',
  styleUrls: ['./monthoverview.component.scss']
})
export class MonthoverviewComponent {
  orderers = [
    {
      name: "Birgit Beispiel",
      order_count: 11,
      cash_sum: 62.20,
      paid: true
    },
    {
      name: "Adam Sandler",
      order_count: 2,
      cash_sum: 10.30,
      paid: false
    },
    {
      name: "Jumbo Schreiner",
      order_count: 41,
      cash_sum: 162.40,
      paid: true
    },
    {
      name: "Max Mustermann",
      order_count: 11,
      cash_sum: 62.20,
      paid: true
    },
    {
      name: "Rudolph Carell",
      order_count: 11,
      cash_sum: 62.20,
      paid: false
    },
    {
      name: "Moritz Bleibtreu",
      order_count: 11,
      cash_sum: 62.20,
      paid: true
    },
    {
      name: "Hans Bärlach",
      order_count: 18,
      cash_sum: 82.90,
      paid: true
    }
  ]
  monthData=[
    {
      date: Temporal.PlainDate.from("2022-12-01"),
      orderers: this.orderers
    },
    {
      date: Temporal.PlainDate.from("2022-11-01"),
      orderers: this.orderers
    },
    {
      date: Temporal.PlainDate.from("2022-10-01"),
      orderers: this.orderers
    },
    {
      date: Temporal.PlainDate.from("2022-09-01"),
      orderers: this.orderers
    },
    {
      date: Temporal.PlainDate.from("2022-08-01"),
      orderers: this.orderers
    },
    {
      date: Temporal.PlainDate.from("2022-07-01"),
      orderers: this.orderers
    },
  ]
}
