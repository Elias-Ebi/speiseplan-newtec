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
import { Meal } from "../../shared/models/meal";
import { CategoryService } from "../../shared/services/category.service";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { groupBy, sortByDate, sortByNumber, sortByString } from "../shared/utils";
import PlainDate = Temporal.PlainDate;
import { HomeOpenOrderDay, HomeQuickOrderMeal, HomeUnchangeableOrderDay } from "./home.models";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatListModule, OrderCardComponent, EuroPipe, MonthNamePipe, MatIconModule, MatDialogModule, MatSnackBarModule, WeekdayNamePipe, RouterLink, FullDatePipe],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  banditPlatesDays: HomeUnchangeableOrderDay[] = [];
  banditPlateCount = 0;
  saldo = 0;
  quickOrderMeals: HomeQuickOrderMeal[] = [];
  quickOrderDate: PlainDate = Temporal.Now.plainDateISO();
  unchangeableOrderDays: HomeUnchangeableOrderDay[] = [];
  openOrdersDays: HomeOpenOrderDay[] = [];

  constructor(
    private dialog: MatDialog,
    private apiService: ApiService,
    private dateService: DateService,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
  }

  openBanditPlateDialog(): void {
    this.dialog.open(BanditPlateDialogComponent, {
      data: this.banditPlatesDays
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  orderOrDeleteMeal(mealId: string, orderId: string, ordered: boolean) {
    if (ordered) {
      this.deleteOrder(orderId);
      return;
    }

    this.orderMeal(mealId);
  }

  async offerOrderAsBanditPlate(orderId: string) {
    this.apiService.offerBanditPlate(orderId)
      .then(async (order) => {
        await this.loadDashboard();

        this.snackBar.open(`${order.meal.name} erfolgreich angeboten.`, '', {
          duration: 2000,
          panelClass: 'success-snackbar'
        });
      })
      .catch((err) => {
        this.snackBar.open(`Das Menü konnte nicht als Räuberteller angeboten werden! ${err.message.message}`, '', {duration: 2000});
      });
  }

  async deleteOrdersOn(date: PlainDate) {
    this.apiService.deleteOrdersOn(date).then(async () => {
      await this.loadDashboard();

      this.snackBar.open(`Bestellungen für den ${date.toLocaleString()} erfolgreich storniert.`, '', {
        duration: 2000,
        panelClass: 'success-snackbar'
      });
    }).catch((err) => {
      this.snackBar.open(`Bestellungen konnten nicht storniert werden! ${err.message.message}`, '', {duration: 2000});
    })
  }

  private async loadDashboard(): Promise<void> {
    const banditPlateP = this.apiService.getBanditPlates();
    const saldoP = this.apiService.getSaldo();
    const quickOrderMealsP = this.apiService.getNextOrderableMeals();
    const unchangeableOrdersP = this.apiService.getUnchangeableOrders();
    const openOrdersP = this.apiService.getOpenOrders();

    const [banditPlates, saldo, quickOrderMeals, todaysOrders, openOrders] = await Promise.all(
      [banditPlateP, saldoP, quickOrderMealsP, unchangeableOrdersP, openOrdersP]
    );

    this.banditPlatesDays = this.transformBanditPlates(banditPlates);
    this.banditPlateCount = banditPlates.length;
    this.saldo = saldo;

    this.quickOrderMeals = this.transformQuickOrderMeals(quickOrderMeals, openOrders);
    if (quickOrderMeals.length) {
      const dateString = quickOrderMeals[0].date
      this.quickOrderDate = PlainDate.from(dateString);
    }

    this.unchangeableOrderDays = this.transformUnchangeableOrders(todaysOrders);
    this.openOrdersDays = this.transformOpenOrders(openOrders);
  }

  private orderMeal(mealId: string) {
    this.apiService.orderMeal(mealId).then(async (order) => {
      await this.loadDashboard();

      this.snackBar.open(`${order.meal.name} erfolgreich bestellt.`, '', {
        duration: 2000,
        panelClass: 'success-snackbar'
      });
    }).catch((err) => {
      this.snackBar.open(`Menü konnte nicht bestellt werden! ${err.message.message}`, '', {duration: 2000});
    });
  }

  private deleteOrder(orderId: string) {
    this.apiService.deleteOrder(orderId).then(async (order) => {
      await this.loadDashboard();

      this.snackBar.open(`${order.meal.name} erfolgreich storniert.`, '', {
        duration: 2000,
        panelClass: 'success-snackbar'
      });
    }).catch((err) => {
      this.snackBar.open(`Bestellung konnte nicht storniert werden! ${err.message.message}`, '', {duration: 2000});
    });
  }

  private transformBanditPlates(orders: Order[]): HomeUnchangeableOrderDay[] {
    const groupedOrders = groupBy(orders, 'date');

    return Object.entries(groupedOrders).map(([dateString, orders]) => {
      return {
        date: Temporal.PlainDate.from(dateString),
        orders: orders
      }
    })
  }

  private transformQuickOrderMeals(meals: Meal[], openOrders: Order[]): HomeQuickOrderMeal[] {
    return meals.map((meal) => {
      const orderForMeal = openOrders.find((order) => order.meal.id === meal.id);
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

  private transformUnchangeableOrders(orders: Order[]): HomeUnchangeableOrderDay[] {
    const groupedOrders = groupBy(orders, 'date');

    return Object.entries(groupedOrders).map(([dateString, orders]) => {
      return {
        date: Temporal.PlainDate.from(dateString),
        orders: orders.sort((a, b) => sortByString(a.guestName, b.guestName) || sortByString(a.id, b.id))
      }
    }).sort((a, b) => sortByDate(a.date, b.date));
  }

  private transformOpenOrders(orders: Order[]): HomeOpenOrderDay[] {
    const groupedOrders = groupBy(orders, 'date');

    return Object.entries(groupedOrders).map(([dateString, orders]) => {
      const sortedById = orders.sort((a, b) => sortByString(a.id, b.id));

      return {
        date: Temporal.PlainDate.from(dateString),
        orders: sortedById,
        mealNames: sortedById.filter(order => !order.guestName).map(order => order.meal.name),
        guestCount: sortedById.filter(order => order.guestName).length
      }
    }).sort((a, b) => sortByDate(a.date, b.date));
  }
}
