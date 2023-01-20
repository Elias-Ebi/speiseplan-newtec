import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderCardComponent} from "../shared/components/order-card/order-card.component";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatTabsModule} from "@angular/material/tabs";
import {Temporal} from "@js-temporal/polyfill";
import {FullDatePipe} from "../../shared/pipes/full-date.pipe";
import {ApiService} from "../../shared/services/api.service";
import {Meal} from "../../shared/models/meal";
import * as _ from "lodash";
import {CategoryService} from "../../shared/services/category.service";
import {Order} from "../../shared/models/order";
import PlainDate = Temporal.PlainDate;
import {MatSnackBar, MatSnackBarModule} from "@angular/material/snack-bar";

interface CardOrder {
  id: string;
  icon: string;
  name: string;
  orderCount: number;
  description: string;
  ordered: boolean;
  orderId: string;
}

interface orderDay {
  date: Temporal.PlainDate,
  meals: Meal[],
  orders: Order[],
  cardOrders: CardOrder[],
  guestOrders: Order[],
}

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, OrderCardComponent, MatIconModule, MatButtonModule, MatTabsModule, FullDatePipe, MatSnackBarModule],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  dataMap = new Map<PlainDate, orderDay>();
  orderDays: orderDay[] = [];


  constructor(
    private apiService: ApiService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
  }

  async ngOnInit(): Promise<void> {
    const orderableMeals = await this.apiService.getOrderableMeals();
    const groupedMeals = _.groupBy(orderableMeals, 'date');

    const openOrders = await this.apiService.getOpenOrders();
    const groupedOrders = _.groupBy(openOrders, 'date');

    Object.keys(groupedOrders).forEach(day => {
      this.dataMap.set(PlainDate.from(day), {
        date: Temporal.PlainDate.from(day),
        meals: groupedMeals[day],
        orders: groupedOrders[day],
        cardOrders: this.transformCardOrders(groupedMeals[day], groupedOrders[day]),
        guestOrders: this.transformGuestOrders(groupedOrders[day]),
      });
    })

    this.orderDays = Array.from(this.dataMap.values());
    this.orderDays.sort((a, b) => PlainDate.compare(a.date, b.date));
  }


  private transformGuestOrders(orders: Order[]): Order[] {
    return orders.filter((order) => order.guestName)
  }


  private transformCardOrders(meals: Meal[], orders: Order[]): CardOrder[] {
    return meals.map((meal) => {
      const orderForMeal = orders.find((order) => order.meal.id === meal.id);
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

  private async updateOpenOrders(date: PlainDate) {
    const dayOrders = await this.apiService.getOrdersDate(date);
    const dayMeals = await this.apiService.getMealsOn(date);

    const orderDay = this.orderDays.find(orderDay => orderDay.date.equals(date));

    if (orderDay) {
      orderDay.meals = dayMeals;
      orderDay.orders = dayOrders;
      orderDay.cardOrders = this.transformCardOrders(dayMeals, dayOrders);
      orderDay.guestOrders = this.transformGuestOrders(dayOrders);
    }
  }

  orderOrDelete(mealId: string, orderId: string, date: PlainDate) {
    if (!orderId) {
      this.orderMeal(mealId,  date);
    } else {
      this.deleteOrder(orderId, date);
    }
  }

  private orderMeal(mealId: string, date: PlainDate) {
    this.apiService.orderMeal(mealId).then(async (order) => {

      await this.updateOpenOrders(date);

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

      await this.updateOpenOrders(date);

      this.snackBar.open(`${order.meal.name} erfolgreich storniert.`, '', {
        duration: 2000,
        panelClass: 'success-snackbar'
      });
    }).catch((err) => {
      this.snackBar.open(`Bestellung konnte nicht storniert werden! ${err.message.message}`, '', {duration: 2000});
    });
  }


  getIcon(categoryId: string): string {
    return this.categoryService.getIconFromCategoryID(categoryId);
  }


}
