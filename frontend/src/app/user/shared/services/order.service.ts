import { Injectable } from '@angular/core';
import { ApiService } from "../../../shared/services/api.service";
import { SnackbarService } from "../../../shared/services/snackbar.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: ApiService, private snackbarService: SnackbarService) {
  }

  handleOrder(mealId: string, orderId: string, ordered: boolean, callback: () => void) {
    if (ordered) {
      this.deleteOrder(orderId, callback);
      return;
    }

    this.order(mealId, callback);
  }

  private order(mealId: string, callback: () => void) {
    this.apiService.orderMeal(mealId).then(async (order) => {
      callback();

      this.snackbarService.success(`${order.meal.name} erfolgreich bestellt.`);
    }).catch((err) => {
      this.snackbarService.error(`Menü konnte nicht bestellt werden! ${err.message.message}`);
    });
  }

  private deleteOrder(orderId: string, callback: () => void) {
    this.apiService.deleteOrder(orderId).then(async (order) => {
      callback();

      this.snackbarService.success(`${order.meal.name} erfolgreich storniert.`);
    }).catch((err) => {
      this.snackbarService.error(`Bestellung konnte nicht storniert werden! ${err.message.message}`);
    });
  }
}
