import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Meal } from "../models/meal";
import { environment } from "../../environment";
import { lastValueFrom } from "rxjs";
import { Order } from "../models/order";
import { Temporal } from "@js-temporal/polyfill";
import { OrderMonth } from "../models/order-month";
import { MealTemplate } from '../models/meal-template';
import { DefaultValues } from '../models/default-values';
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

  async takeBanditPlate(orderId: string): Promise<Order> {
    const response = this.httpClient.put<Order>(`${environment.apiUrl}/orders/banditplates/take/${orderId}`, {});
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

  async getMonthOverview(): Promise<OrderMonth[]> {
    const response = this.httpClient.get<OrderMonth[]>(`${environment.apiUrl}/order-month/month-overview`);
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

  async getMealTemplate(): Promise<MealTemplate[]> {
    const response = this.httpClient.get<MealTemplate[]>(`${environment.apiUrl}/meals/mealTemplates`);
    return lastValueFrom(response);
  }

  async putMealTemplate(data: any): Promise<MealTemplate> {
    const response = this.httpClient.put<MealTemplate>(`${environment.apiUrl}/meals/mealTemplates`, data);
    return lastValueFrom(response);
  }

  async deleteMealTemplate(id: string): Promise<MealTemplate> {
    const response = this.httpClient.delete<MealTemplate>(`${environment.apiUrl}/meals/mealTemplates/remove/${id}`);
    return lastValueFrom(response);
  }

  async addMeal(meal: Meal): Promise<Meal> {
    const response = this.httpClient.post<Meal>(`${environment.apiUrl}/meals`, meal);
    return lastValueFrom(response);
  }

  async updateMeal(meal: Meal): Promise<Meal> {
    const response = this.httpClient.put<Meal>(`${environment.apiUrl}/meals`, meal);
    return lastValueFrom(response);
  }

  async deleteMeal(id: string): Promise<Meal> {
    const response = this.httpClient.delete<Meal>(`${environment.apiUrl}/meals/${id}`);
    return lastValueFrom(response);
  }

  async getMealCountForWeek(mondayDate: PlainDate): Promise<number[]> {
    const response = this.httpClient.get<number[]>(`${environment.apiUrl}/meals/meal-counter/${mondayDate.toString()}`);
    return lastValueFrom(response);
  }
  
  async getDefaultValues(): Promise<DefaultValues> {
    const response = this.httpClient.get<DefaultValues>(`${environment.apiUrl}/meals/default-values`);
    return lastValueFrom(response);
  }

  async setDefaultValues(defaultValues: DefaultValues): Promise<DefaultValues> {
    const response = this.httpClient.post<DefaultValues>(`${environment.apiUrl}/meals/default-values`, defaultValues);
    return lastValueFrom(response);
  }

  async deleteMultipleOrdersAdmin(orders: Order[]): Promise<Order> {
    const body = {orders: orders}
    const response = this.httpClient.post<Order>(`${environment.apiUrl}/orders/multiple-orders/delete/admin/`, body)
    return lastValueFrom(response);
  }

  async getAllChangeableOrders(): Promise<Order[]> {
    const response = this.httpClient.get<Order[]>(`${environment.apiUrl}/orders/admin/changeable`);
    return lastValueFrom(response);
  }



}
