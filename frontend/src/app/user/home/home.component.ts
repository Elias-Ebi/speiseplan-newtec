import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { OrderCardComponent } from "../shared/components/order-card/order-card.component";
import { EuroPipe } from "../../shared/pipes/euro.pipe";
import { Temporal } from "@js-temporal/polyfill";
import { MatIconModule } from "@angular/material/icon";
import { MatDialog } from "@angular/material/dialog";
import { BanditPlateDialogComponent } from "./bandit-plate-dialog/bandit-plate-dialog.component";
import { Router, RouterLink } from "@angular/router";
import { ApiService } from "../../shared/services/api.service";
import { Order } from "../../shared/models/order";
import { FullDatePipe } from "../../shared/pipes/full-date.pipe";
import { DateService } from "../../shared/services/date.service";
import { Meal } from "../../shared/models/meal";
import { CategoryService } from "../../shared/services/category.service";
import { groupBy, sortByDate, sortByNumber, sortByString } from "../shared/utils";
import { HomeOpenOrderDay, HomeQuickOrderMeal, HomeUnchangeableOrderDay } from "./home.models";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { OrderService } from "../shared/services/order.service";
import { lastValueFrom } from "rxjs";
import { StateService } from "../../shared/services/state.service";
import PlainDate = Temporal.PlainDate;

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatButtonModule, OrderCardComponent, EuroPipe, MatIconModule, RouterLink, FullDatePipe],
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
    private snackbarService: SnackbarService,
    private orderService: OrderService,
    private router: Router,
    private stateService: StateService
  ) {
  }

  openBanditPlateDialog(): void {
    const dialogRef = this.dialog.open(BanditPlateDialogComponent, {
      data: this.banditPlatesDays,
    });

    const dialogClosedP = lastValueFrom(dialogRef.afterClosed());
    dialogClosedP.then(async () => {
      await this.loadDashboard();
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadDashboard();
  }

  navigateToOrderPage(date: PlainDate) {
    this.stateService.setSelectedOrderDate(date.toString());
    this.router.navigateByUrl('/bestellen');
  }

  async handleOrder(mealId: string, orderId: string, ordered: boolean) {
    await this.orderService.handleOrder(mealId, orderId, ordered);
    await this.loadDashboard();
  }

  async offerOrderAsBanditPlate(orderId: string) {
    this.apiService.offerBanditPlate(orderId).then(async (order) => {
      await this.loadDashboard();

      this.snackbarService.success(`${order.meal.name} erfolgreich angeboten.`);
    })
      .catch((err) => {
        this.snackbarService.error(`Das Menü konnte nicht als Räuberteller angeboten werden! ${err.message.message}`);
      });
  }

  async deleteOrdersOn(date: PlainDate) {
    this.apiService.deleteOrdersOn(date).then(async () => {
      await this.loadDashboard();

      this.snackbarService.success(`Bestellungen für den ${date.toLocaleString()} erfolgreich storniert.`);
    })
      .catch((err) => {
        this.snackbarService.error(`Bestellungen konnten nicht storniert werden! ${err.message.message}`);
      });
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

    const userOrders = openOrders.filter(order => !order.guestName)

    this.quickOrderMeals = this.transformQuickOrderMeals(quickOrderMeals, userOrders);
    if (quickOrderMeals.length) {
      const dateString = quickOrderMeals[0].date
      this.quickOrderDate = PlainDate.from(dateString);
    }

    this.unchangeableOrderDays = this.transformUnchangeableOrders(todaysOrders);
    this.openOrdersDays = this.transformOpenOrders(openOrders);
  }

  private transformBanditPlates(orders: Order[]): HomeUnchangeableOrderDay[] {
    const groupedOrders = groupBy(orders, 'date');
    const groupedOrdersArray = Array.from(groupedOrders.entries());

    return groupedOrdersArray.map(([dateString, orders]) => {
      return {
        date: Temporal.PlainDate.from(dateString),
        orders: orders
      }
    })
  }

  private transformQuickOrderMeals(meals: Meal[], openOrders: Order[]): HomeQuickOrderMeal[] {
    openOrders = openOrders.sort((a, b) => sortByString(a.meal.id, b.meal.id));

    return meals.map((meal) => {
      const orderIndex = openOrders.findIndex((order) => order.meal.id === meal.id);
      const orderForMeal = orderIndex !== -1 ? openOrders[orderIndex] : null;
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
    const groupedOrdersArray = Array.from(groupedOrders.entries());

    return groupedOrdersArray.map(([dateString, orders]) => {
      const sortedOrders = orders.sort((a, b) => sortByString(a.guestName, b.guestName) || sortByString(a.id, b.id));

      return {
        date: Temporal.PlainDate.from(dateString),
        orders: sortedOrders
      }
    }).sort((a, b) => sortByDate(a.date, b.date));
  }

  private transformOpenOrders(orders: Order[]): HomeOpenOrderDay[] {
    const groupedOrders = groupBy(orders, 'date');
    const groupedOrdersArray = Array.from(groupedOrders.entries());

    return groupedOrdersArray.map(([dateString, orders]) => {
      const sortedOrders = orders.sort((a, b) => sortByString(a.id, b.id));
      const mealNames = sortedOrders.filter(order => !order.guestName).map(order => order.meal.name);
      const guestNames = sortedOrders.filter(order => order.guestName).map(order => order.guestName);
      const guestCount = new Set(guestNames).size;

      return {
        date: Temporal.PlainDate.from(dateString),
        orders: sortedOrders,
        mealNames,
        guestCount
      }
    }).sort((a, b) => sortByDate(a.date, b.date));
  }
}
