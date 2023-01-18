import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Meal } from "../models/meal";
import { environment } from "../../environment";
import { lastValueFrom } from "rxjs";
import { Order } from "../models/order";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) {
  }

  async getBanditPlates(): Promise<Order[]> {
    const response = this.httpClient.get<Order[]>(`${environment.apiUrl}/orders/banditplates`);
    return lastValueFrom(response);
  }

  async getSaldo(): Promise<number> {
    const response = this.httpClient.get<number>(`${environment.apiUrl}/orders/current-total`);
    return lastValueFrom(response);
  }

  async getTodaysOrders(): Promise<Order[]> {
    const response = this.httpClient.get<Order[]>(`${environment.apiUrl}/orders/today`);
    return lastValueFrom(response);
  }

  async getOpenOrders(): Promise<Order[]> {
    const response = this.httpClient.get<Order[]>(`${environment.apiUrl}/orders/open`);
    return lastValueFrom(response);
  }

  async getOrderableMeals(): Promise<Meal[]> {
    const response = this.httpClient.get<Meal[]>(`${environment.apiUrl}/meals`);
    return lastValueFrom(response);
  }
}
