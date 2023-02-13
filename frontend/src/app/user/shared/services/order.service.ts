import { Injectable } from '@angular/core';
import { ApiService } from "../../../shared/services/api.service";
import { SnackbarService } from "../../../shared/services/snackbar.service";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private apiService: ApiService, private snackbarService: SnackbarService) {
  }

  async handleOrder(mealId: string, orderId: string, ordered: boolean): Promise<void> {
    if (ordered) {
      return this.deleteOrder(orderId);
    }

    return this.order(mealId);
  }

  private async order(mealId: string) {
    return this.apiService.orderMeal(mealId).then(async (order) => {
      this.snackbarService.success(`${order.meal.name} erfolgreich bestellt.`);
    }).catch((err) => {
      this.snackbarService.error(`Menü konnte nicht bestellt werden! ${err.message.message}`);
    });
  }

  private async deleteOrder(orderId: string) {
    return this.apiService.deleteOrder(orderId).then(async (order) => {
      this.snackbarService.success(`${order.meal.name} erfolgreich storniert.`);
    }).catch((err) => {
      this.snackbarService.error(`Bestellung konnte nicht storniert werden! ${err.message.message}`);
    });
  }
}
