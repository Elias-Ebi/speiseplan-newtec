import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from "@angular/material/icon";
import { EuroPipe } from "../../shared/pipes/euro.pipe";
import { Temporal } from "@js-temporal/polyfill";
import { WeekdayNamePipe } from "../../shared/pipes/weekday-name.pipe";
import { MatTabsModule } from "@angular/material/tabs";
import { MonthNamePipe } from "../../shared/pipes/month-name.pipe";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { FormsModule } from "@angular/forms";
import { MatTableModule } from "@angular/material/table";
import { ApiService } from "../../shared/services/api.service";
import { DateService } from "../../shared/services/date.service";

@Component({
  selector: 'app-monthoverview',
  standalone: true,
  imports: [CommonModule, MatIconModule, EuroPipe, WeekdayNamePipe, MatTabsModule, MonthNamePipe, MatButtonModule, MatInputModule, FormsModule, MatTableModule],
  templateUrl: './monthoverview.component.html',
  styleUrls: ['./monthoverview.component.scss']
})
export class MonthoverviewComponent implements OnInit {

  async ngOnInit(): Promise<void> {

  }
  customers = [
    {
      name: "Birgit Beispiel",
      count: 11,
      total: 62.20,
      paid: true
    },
    {
      name: "Adam Sandler",
      count: 2,
      total: 10.30,
      paid: false
    },
    {
      name: "Jumbo Schreiner",
      count: 41,
      total: 162.40,
      paid: true
    },
    {
      name: "Max Mustermann",
      count: 11,
      total: 62.20,
      paid: true
    },
    {
      name: "Rudolph Carell",
      count: 11,
      total: 62.20,
      paid: false
    },
    {
      name: "Moritz Bleibtreu",
      count: 11,
      total: 62.20,
      paid: true
    },
    {
      name: "Hans Bärlach",
      count: 18,
      total: 82.90,
      paid: true
    }
  ]
  monthData = [
    {
      date: Temporal.PlainDate.from("2022-12-01"),
      customers: this.customers
    },
    {
      date: Temporal.PlainDate.from("2022-11-01"),
      customers: this.customers
    },
    {
      date: Temporal.PlainDate.from("2022-10-01"),
      customers: this.customers
    },
    {
      date: Temporal.PlainDate.from("2022-09-01"),
      customers: this.customers
    },
    {
      date: Temporal.PlainDate.from("2022-08-01"),
      customers: this.customers
    },
    {
      date: Temporal.PlainDate.from("2022-07-01"),
      customers: this.customers
    },
  ]

  displayedColumns: string[] = ['customer', 'count', 'sum', 'paid_status', 'paid_button'];
}
