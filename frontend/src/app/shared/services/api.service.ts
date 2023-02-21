import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Meal } from "../models/meal";
import { environment } from "../../environment";
import { lastValueFrom } from "rxjs";
import { Order } from "../models/order";
import { Temporal } from "@js-temporal/polyfill";
import { OrderMonth } from "../models/order-month";
import PlainDate = Temporal.PlainDate;

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

  async offerBanditPlate(orderId: string): Promise<Order> {
    const response = this.httpClient.put<Order>(`${environment.apiUrl}/orders/banditplates/offer/${orderId}`, {});
    return lastValueFrom(response);
  }

  async getSaldo(): Promise<number> {
    const response = this.httpClient.get<number>(`${environment.apiUrl}/order-month/current-balance`);
    return lastValueFrom(response);
  }

  async getMealsOn(date: PlainDate): Promise<Meal[]> {
    const response = this.httpClient.get<Meal[]>(`${environment.apiUrl}/meals/date/${date.toString()}`);
    return lastValueFrom(response);
  }

  async getOderMonthsFrom(date: PlainDate): Promise<OrderMonth[]> {
    const response = this.httpClient.get<OrderMonth[]>(`${environment.apiUrl}/order-month/${date.month}/${date.year}`);
    return lastValueFrom(response);
  }

  async changePaymentStatus(id: string): Promise<OrderMonth> {
    const response = this.httpClient.put<OrderMonth>(`${environment.apiUrl}/order-month/payment-status/${id}`, {});
    return lastValueFrom(response);
  }

  async getNextOrderableMeals(): Promise<Meal[]> {
    const response = this.httpClient.get<Meal[]>(`${environment.apiUrl}/meals/next-orderable`);
    return lastValueFrom(response);
  }

  async getUnchangeableOrders(): Promise<Order[]> {
    const response = this.httpClient.get<Order[]>(`${environment.apiUrl}/orders/unchangeable`);
    return lastValueFrom(response);
  }

  async getOrdersDate(date: PlainDate): Promise<Order[]> {
    const response = this.httpClient.get<Order[]>(`${environment.apiUrl}/orders/date/${date.toString()}`);
    return lastValueFrom(response);
  }

  async getAllOrdersOnDate(date: PlainDate): Promise<Order[]> {
    const response = this.httpClient.get<Order[]>(`${environment.apiUrl}/orders/date/${date.toString()}/all`);
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

  async orderMeal(mealID: string, guestName?: string): Promise<Order> {
    let params = {};
    if (guestName) {
      params = {guestName}
    }

    const response = this.httpClient.post<Order>(`${environment.apiUrl}/orders/${mealID}`, {}, {params});
    return lastValueFrom(response);
  }

  async deleteOrder(orderID: string): Promise<Order> {
    const response = this.httpClient.delete<Order>(`${environment.apiUrl}/orders/${orderID}`)
    return lastValueFrom(response);
  }

  async deleteOrdersOn(date: PlainDate): Promise<Order[]> {
    const response = this.httpClient.delete<Order[]>(`${environment.apiUrl}/orders/delete-day/${date.toString()}`)
    return lastValueFrom(response);
  }

  async getHistory(): Promise<OrderMonth[]> {
    const response = this.httpClient.get<OrderMonth[]>(`${environment.apiUrl}/order-month/history`);
    return lastValueFrom(response);
  }
}
