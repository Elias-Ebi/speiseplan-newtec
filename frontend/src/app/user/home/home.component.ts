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
import { Meal } from "../../shared/models/meal";
import { CategoryService } from "../../shared/services/category.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import PlainDate = Temporal.PlainDate;

interface OpenOrder {
  date: PlainDate;
  mealNames: string[];
  guests: number;
}

interface QuickOrderMeal {
  id: string;
  icon: string;
  name: string;
  orderCount: number;
  description: string;
  ordered: boolean;
  orderId: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatListModule, OrderCardComponent, EuroPipe, MonthNamePipe, MatIconModule, MatDialogModule, MatSnackBarModule, WeekdayNamePipe, RouterLink, FullDatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  latestUnchangableDate: PlainDate;
  nextOrderableDate: PlainDate;
  currentDate: PlainDate;
  banditPlates: Order[] = [];
  saldo = 0;
  quickOrderMeals: QuickOrderMeal[] = [];
  todaysOrders: Order[] = [];
  openOrders: OpenOrder[] = [];

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private dateService: DateService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    this.latestUnchangableDate = this.dateService.getLatestUnchangeableDate();
    this.nextOrderableDate = this.dateService.getNextOrderableDate();
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
    const quickOrderMealsPromise = this.apiService.getMealsOn(this.nextOrderableDate);
    const todaysOrdersPromise = this.apiService.getTodaysOrders();
    const openOrdersPromise = this.apiService.getOpenOrders();

    const [banditPlates, saldo, quickOrderMeals, todaysOrders, openOrders] = await Promise.all(
      [banditPlatePromise, saldoPromise, quickOrderMealsPromise, todaysOrdersPromise, openOrdersPromise]
    );

    this.banditPlates = banditPlates;
    this.saldo = saldo;
    this.quickOrderMeals = this.transformQuickOrderMeals(quickOrderMeals, openOrders);
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

  private transformQuickOrderMeals(meals: Meal[], openOrders: Order[]): QuickOrderMeal[] {
    return meals.map((meal) => {
      const orderForMeal = openOrders.find((order) => order.meal.id === meal.id);
      return {
        id: meal.id,
        icon: this.categoryService.getIconFromCategoryID(meal.categoryId),
        name: meal.name,
        orderCount: meal.orderCount,
        description: meal.description,
        ordered: !!orderForMeal,
        orderId: orderForMeal?.id || ''
      }
    });
  }

  private async updateOpenOrders(): Promise<OpenOrder[]> {
    const openOrders = await this.apiService.getOpenOrders();
    return this.transformOpenOrders(openOrders);
  }

  orderOrDelete(mealId: string, mealName: string, orderId: string) {
    if (!orderId) {
      this.orderMeal(mealId, mealName);
    } else {
      this.deleteOrder(orderId, mealName);
    }
  }

  private orderMeal(mealId: string, mealName: string) {
    this.apiService.orderMeal(mealId).then(async (order) => {
      const mealToSelect = this.quickOrderMeals.find((meal) => meal.id === mealId);

      if (mealToSelect) {
        mealToSelect.ordered = true;
        mealToSelect.orderId = order.id;
        mealToSelect.orderCount = order.meal.orderCount;
      }

      this.saldo += order.meal.total;
      this.openOrders = await this.updateOpenOrders();

      this.snackBar.open(`${mealName} erfolgreich bestellt.`, '', {duration: 2000, panelClass: 'success-snackbar'});
    }).catch((err) => {
      this.snackBar.open(`${mealName} konnte nicht bestellt werden! ${err.message.message}`, '', {duration: 2000});
    });
  }

  private deleteOrder(orderId: string, mealName: string) {
    this.apiService.deleteOrder(orderId).then(async (order) => {
      const mealToSelect = this.quickOrderMeals.find((meal) => meal.orderId === orderId);

      if (mealToSelect) {
        mealToSelect.ordered = false;
        mealToSelect.orderId = '';
        mealToSelect.orderCount = order.meal.orderCount;

        this.saldo -= order.meal.total;
        this.openOrders = await this.updateOpenOrders();

        this.snackBar.open(`${mealName} erfolgreich storniert.`, '', {duration: 2000, panelClass: 'success-snackbar'});
      }
    }).catch((err) => {
      this.snackBar.open(`${mealName} konnte nicht storniert werden! ${err.message.message}`, '', {duration: 2000});
    });
  }
}
