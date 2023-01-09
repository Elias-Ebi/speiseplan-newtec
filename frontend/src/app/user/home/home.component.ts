import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MatListModule } from "@angular/material/list";
import { OrderCardComponent } from "../shared/components/order-card/order-card.component";
import { EuroPipe } from "../../shared/pipes/euro.pipe";
import { MonthNamePipe } from "../../shared/pipes/month-name.pipe";
import { Temporal } from "@js-temporal/polyfill";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { BanditPlateDialogComponent } from "./bandit-plate-dialog/bandit-plate-dialog.component";
import { WeekdayNamePipe } from "../../shared/pipes/weekday-name.pipe";
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatListModule, OrderCardComponent, EuroPipe, MonthNamePipe, MatIconModule, MatDialogModule, WeekdayNamePipe, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  date = Temporal.Now.plainDateISO();
  banditPlates = [
    {name: "Harry Potter", description: "Fleischküchle in Zwiebelsoße mit Kartoffelpüree und Rahmkarotten"},
    {
      name: "Albus Dumbledore",
      description: "Salat “Sizilia” Tomaten, Basilikum, Zuchinistreifen, Artischoken, Thunfisch, Oliven, Orangen und Balsamicodressing"
    },
  ];
  myOrderToday = [
    {name: 'Ich', meal: 'Schnitzel', offered: false},
    {name: 'Draco Malfoy', meal: 'Salat Sizilia', offered: true},
  ];
  saldo: number = 38.5;
  menues = [
    {
      icon: "assets/food_icons/meat_icon.png",
      name: "Fleischküchle",
      amount: 17,
      description: "Fleischküchle in Zwiebelsoße mit Kartoffelpüree und Rahmkarotten",
      ordered: false
    },
    {
      icon: "assets/food_icons/vegan_icon.png",
      name: "Bratlinge",
      amount: 12,
      description: "Grünkern-Linsen-Gemüse-Bratlinge mit Tomaten-Paprika Salsa und Grillgemüse",
      ordered: true
    },
    {
      icon: "assets/food_icons/salad_icon.png",
      name: "Salat Sizilia",
      amount: 3,
      description: "Salat “Sizilia” Tomaten, Basilikum, Zuchinistreifen, Artischoken, Thunfisch, Oliven, Orangen und Balsamicodressing",
      ordered: false
    }
  ];

  myOrders = [
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Bratlinge", "Salat"],
      guests: 7
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Fleischküchle"],
      guests: 0
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Burger"],
      guests: 0
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Salat"],
      guests: 0
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Pommes"],
      guests: 3
    },
    {
      date: Temporal.Now.plainDateISO(),
      meals: ["Schnitzel"],
      guests: 0
    },
  ];

  constructor(private dialog: MatDialog) {
  }

  openBanditPlateDialog(): void {
    this.dialog.open(BanditPlateDialogComponent, {
      data: this.banditPlates
    });
  }
}
