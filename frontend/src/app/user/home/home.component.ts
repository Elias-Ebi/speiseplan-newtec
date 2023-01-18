import { Component, OnInit } from '@angular/core';
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
import { ApiService } from "../../shared/services/api.service";
import { Order } from "../../shared/models/order";
import { FullDatePipe } from "../../shared/pipes/full-date.pipe";
import { DateService } from "../../shared/services/date.service";
import * as _ from "lodash";
import PlainDate = Temporal.PlainDate;

interface OpenOrder {
  date: PlainDate;
  mealNames: string[],
  guests: number
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatListModule, OrderCardComponent, EuroPipe, MonthNamePipe, MatIconModule, MatDialogModule, WeekdayNamePipe, RouterLink, FullDatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  latestUnchangableDate: PlainDate;
  currentDate: PlainDate;
  banditPlates: Order[] = [];
  saldo = 0;
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
  todaysOrders: Order[] = [];
  openOrders: OpenOrder[] = [];

  constructor(private dialog: MatDialog, private apiService: ApiService, private dateService: DateService) {
    this.latestUnchangableDate = this.dateService.getLatestUnchangeableDate();
    this.currentDate = Temporal.Now.plainDateISO();
  }

  openBanditPlateDialog(): void {
    this.dialog.open(BanditPlateDialogComponent, {
      data: this.banditPlates
    });
  }

  async ngOnInit(): Promise<void> {
    const banditPlatePromise = this.apiService.getBanditPlates();
    const saldoPromise = this.apiService.getSaldo();
    const todaysOrdersPromise = this.apiService.getTodaysOrders();
    const openOrdersPromise = this.apiService.getOpenOrders();

    const [banditPlates, saldo, todaysOrders, openOrders] = await Promise.all([banditPlatePromise, saldoPromise, todaysOrdersPromise, openOrdersPromise]);

    this.banditPlates = banditPlates;
    this.saldo = saldo;
    this.todaysOrders = todaysOrders;
    this.openOrders = this.transformOpenOrders(openOrders);
  }

  private transformOpenOrders(orders: Order[]): OpenOrder[] {
    const groupedOrders = _.groupBy(orders, 'date');

    return Object.keys(groupedOrders).map((dateString) => {
      return {
        date: Temporal.PlainDate.from(dateString),
        mealNames: groupedOrders[dateString].filter(order => !order.guestName).map(order => order.meal.name),
        guests: groupedOrders[dateString].filter(order => order.guestName).length
      } as OpenOrder;
    })
  }
}
