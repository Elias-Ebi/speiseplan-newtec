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
import { groupBy, sortByDate, sortByNumber, sortByString } from "../shared/utils";
import { MatDialog } from "@angular/material/dialog";
import { GuestOrderDialogComponent } from "./guest-order-dialog/guest-order-dialog.component";
import * as _ from "lodash";
import {GuestOrderDialogValues, OrderDay, OrderMeal} from "./order.models";
import { firstValueFrom, lastValueFrom } from "rxjs";
import { OrderService } from "../shared/services/order.service";
import { StateService } from "../../shared/services/state.service";
import PlainDate = Temporal.PlainDate;
import {CancelGuestOrderDialogComponent} from "./cancel-dialog/cancel-guest-order-dialog.component";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, OrderCardComponent, MatIconModule, MatButtonModule, MatTabsModule, FullDatePipe],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orderDays: OrderDay[] = [];
  selectedTabIndex: number = 0;
  private dataMap = new Map<string, OrderDay>();

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private categoryService: CategoryService,
    private orderService: OrderService,
    private stateService: StateService
  ) {
  }

  async ngOnInit(): Promise<void> {
    const orderableMealsP = this.apiService.getOrderableMeals();
    const openOrdersP = this.apiService.getOpenOrders();

    const [orderableMeals, openOrders] = await Promise.all([orderableMealsP, openOrdersP]);

    const groupedMeals = groupBy(orderableMeals, 'date');
    const groupedMealsArray = Array.from(groupedMeals.entries());
    const groupedOrders = groupBy(openOrders, 'date');

    groupedMealsArray.forEach(([day, meals]) => {
      const orders = groupedOrders.get(day) || [];
      const userOrders = orders.filter(order => !order.guestName);

      this.dataMap.set(day, {
        date: Temporal.PlainDate.from(day),
        orderMeals: this.transformOrderCards(meals, userOrders),
        guestOrders: this.transformGuestOrders(orders),
        anyOrders: !!orders.length,
      });
    })

    this.orderDays = this.generateOrderDaysArray();

    const selectedDate = await firstValueFrom(this.stateService.selectedOrderDate);
    if (selectedDate) {
      this.selectedTabIndex = this.orderDays.findIndex((val) => val.date.toString() === selectedDate) || 0;
    }
  }

  openGuestOrderDialog(date: PlainDate): void {
    const orderDay = this.dataMap.get(date.toString());
    if (!orderDay) {
      return;
    }

    const guestOrderDay = this.generateGuestOrderDay(orderDay);

    const dialogRef = this.dialog.open(GuestOrderDialogComponent, {
      data: guestOrderDay,
      autoFocus: false,
    });

    const dialogClosedP = lastValueFrom(dialogRef.afterClosed());
    dialogClosedP.then(async (values: GuestOrderDialogValues) => {
      if (!values) {
        return;
      }

      await this.resolveGuestOrderDialog(values, date);
    });
  }

  openCancelOrderDialog(date: PlainDate, orderId: String): void {
    const dialogRef = this.dialog.open(CancelGuestOrderDialogComponent, {
      data: {date, orderId},
      autoFocus: false,
    });

    const dialogClosedP = lastValueFrom(dialogRef.afterClosed());
    dialogClosedP.then(async (reload: boolean) => {
      if(reload) {
        await this.updateOrderDay(date);
      }
    });
  }

  async handleOrder(mealId: string, orderId: string, date: PlainDate, ordered: boolean) {
    await this.orderService.handleOrder(mealId, orderId, ordered);
    await this.updateOrderDay(date);
  }

  async resolveGuestOrderDialog(values: GuestOrderDialogValues, date: PlainDate) {
    const mealOrders = values.mealIds.map(mealId => this.apiService.orderMeal(mealId, values.guestName));
    await Promise.all(mealOrders);
    await this.updateOrderDay(date);
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
    const ordersP = this.apiService.getOrdersDate(date);
    const mealsP = this.apiService.getMealsOn(date);

    const [orders, meals] = await Promise.all([ordersP, mealsP]);

    const orderDay = this.dataMap.get(date.toString());
    if (!orderDay) {
      return;
    }

    const userOrders = orders.filter(order => !order.guestName)

    orderDay.orderMeals = this.transformOrderCards(meals, userOrders);
    orderDay.guestOrders = this.transformGuestOrders(orders);

    orderDay.anyOrders = !!orders.length;

    this.orderDays = this.generateOrderDaysArray();
  }

  private generateGuestOrderDay(orderDay: OrderDay): OrderDay {
    const guestOrderDay = _.cloneDeep(orderDay);
    guestOrderDay.orderMeals.forEach((orderMeal) => orderMeal.ordered = false);
    return guestOrderDay;
  }

  private generateOrderDaysArray(): OrderDay[] {
    return Array.from(this.dataMap.values()).sort((a, b) => sortByDate(a.date, b.date));
  }
}
