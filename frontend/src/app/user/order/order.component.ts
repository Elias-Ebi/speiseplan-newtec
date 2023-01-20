import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderCardComponent } from "../shared/components/order-card/order-card.component";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTabsModule } from "@angular/material/tabs";
import { Temporal } from "@js-temporal/polyfill";
import { FullDatePipe } from "../../shared/pipes/full-date.pipe";
import { ApiService } from "../../shared/services/api.service";
import { Meal } from "../../shared/models/meal";
import { CategoryService } from "../../shared/services/category.service";
import { Order } from "../../shared/models/order";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { OrderDay } from "./models/order-day";
import { OrderMeal } from "./models/order-meal";
import { groupBy, sortByDate, sortByNumber, sortByString } from "../shared/utils";
import PlainDate = Temporal.PlainDate;

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, OrderCardComponent, MatIconModule, MatButtonModule, MatTabsModule, FullDatePipe, MatSnackBarModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  dataMap = new Map<PlainDate, OrderDay>();
  orderDays: OrderDay[] = [];


  constructor(
    private apiService: ApiService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
  }

  async ngOnInit(): Promise<void> {
    const orderableMeals = await this.apiService.getOrderableMeals();
    const groupedMeals = groupBy(orderableMeals, 'date');

    const openOrders = await this.apiService.getOpenOrders();
    const groupedOrders = groupBy(openOrders, 'date');

    Object.keys(groupedMeals).forEach(day => {
      const meals = groupedMeals[day];
      const orders = groupedOrders[day] || [];

      this.dataMap.set(PlainDate.from(day), {
        date: Temporal.PlainDate.from(day),
        orderMeals: this.transformOrderCards(meals, orders),
        guestOrders: this.transformGuestOrders(orders)
      });
    })

    this.orderDays = Array.from(this.dataMap.values());
    this.orderDays.sort((a, b) => sortByDate(a.date, b.date));
  }

  orderOrDelete(mealId: string, orderId: string, date: PlainDate) {
    if (orderId) {
      this.deleteOrder(orderId, date);
    }

    this.orderMeal(mealId, date);
  }

  private transformOrderCards(meals: Meal[], orders: Order[]): OrderMeal[] {
    return meals.map((meal) => {
      const orderForMeal = orders.find((order) => order.meal.id === meal.id);
      const category = this.categoryService.getCategory(meal.categoryId);
      return {
        id: meal.id,
        icon: category?.icon || '',
        orderIndex: category?.orderIndex || -1,
        name: meal.name,
        orderCount: meal.orderCount,
        description: meal.description,
        ordered: !!orderForMeal,
        orderId: orderForMeal?.id || ''
      }
    }).sort((a, b) => sortByNumber(a.orderIndex, b.orderIndex) || sortByString(a.id, b.id));
  }

  private transformGuestOrders(orders: Order[]): Order[] {
    return orders.filter((order) => order.guestName).sort((a, b) => sortByString(a.id, b.id));
  }

  private async updateOrderDay(date: PlainDate) {
    const orders = await this.apiService.getOrdersDate(date);
    const meals = await this.apiService.getMealsOn(date);

    const orderDay = this.orderDays.find(orderDay => orderDay.date.equals(date));
    if (!orderDay) {
      return;
    }

    orderDay.orderMeals = this.transformOrderCards(meals, orders);
    orderDay.guestOrders = this.transformGuestOrders(orders);

  }

  private orderMeal(mealId: string, date: PlainDate) {
    this.apiService.orderMeal(mealId).then(async (order) => {
      await this.updateOrderDay(date);

      this.snackBar.open(`${order.meal.name} erfolgreich bestellt.`, '', {
        duration: 2000,
        panelClass: 'success-snackbar'
      });
    }).catch((err) => {
      this.snackBar.open(`Bestellung konnte nicht bestellt werden! ${err.message.message}`, '', {duration: 2000});
    });
  }

  private deleteOrder(orderId: string, date: PlainDate) {
    this.apiService.deleteOrder(orderId).then(async (order) => {
      await this.updateOrderDay(date);

      this.snackBar.open(`${order.meal.name} erfolgreich storniert.`, '', {
        duration: 2000,
        panelClass: 'success-snackbar'
      });
    }).catch((err) => {
      this.snackBar.open(`Bestellung konnte nicht storniert werden! ${err.message.message}`, '', {duration: 2000});
    });
  }
}
