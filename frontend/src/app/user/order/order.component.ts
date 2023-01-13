import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderCardComponent} from "../shared/components/order-card/order-card.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {Temporal} from "@js-temporal/polyfill";
import {FullDatePipe} from "../../shared/pipes/full-date.pipe";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, OrderCardComponent, MatIconModule, MatButtonModule, MatTabsModule, FullDatePipe],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent {
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

  guestOrders = [
    {name: 'Ich', meal: 'Schnitzel'},
    {name: 'Draco Malfoy', meal: 'Salat Sizilia'}
  ];

  data = [
    {
      datum: Temporal.PlainDate.from("2022-12-01"),
      meals: this.menues,
      orders: [],
      guestOrders: this.guestOrders
    },
    {
      datum: Temporal.PlainDate.from("2022-12-02"),
      meals: this.menues,
      orders: [],
      guestOrders: this.guestOrders
    },
    {
      datum: Temporal.PlainDate.from("2022-12-03"),
      meals: this.menues,
      orders: [],
      guestOrders: this.guestOrders
    },    {
      datum: Temporal.PlainDate.from("2022-11-04"),
      meals: this.menues,
      orders: [],
      guestOrders: this.guestOrders
    },    {
      datum: Temporal.PlainDate.from("2022-11-05"),
      meals: this.menues,
      orders: [],
      guestOrders: this.guestOrders
    },    {
      datum: Temporal.PlainDate.from("2022-11-06"),
      meals: this.menues,
      orders: [],
      guestOrders: this.guestOrders
    },    {
      datum: Temporal.PlainDate.from("2022-11-07"),
      meals: this.menues,
      orders: [],
      guestOrders: this.guestOrders
    },    {
      datum: Temporal.PlainDate.from("2022-11-08"),
      meals: this.menues,
      orders: [],
      guestOrders: this.guestOrders
    },    {
      datum: Temporal.PlainDate.from("2022-11-09"),
      meals: this.menues,
      orders: [],
      guestOrders: this.guestOrders
    },



  ]
}
