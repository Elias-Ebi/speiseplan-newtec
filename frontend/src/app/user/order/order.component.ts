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
import * as _ from "lodash";
import { CategoryService } from "../../shared/services/category.service";

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CommonModule, OrderCardComponent, MatIconModule, MatButtonModule, MatTabsModule, FullDatePipe],
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  guestOrders = [
    {name: 'Ich', meal: 'Schnitzel'},
    {name: 'Draco Malfoy', meal: 'Salat Sizilia'}
  ];

  data: {
    date: Temporal.PlainDate
    meals: Meal[],
    orders: [],
    guestOrders: { name: string, meal: string }[]
  }[] = []

  constructor(private apiService: ApiService, private categoryService: CategoryService) {
  }

  async ngOnInit(): Promise<void> {
    const orderableMeals = await this.apiService.getOrderableMeals();
    const groupedItems = _.groupBy(orderableMeals, 'date');

    this.data = Object.keys(groupedItems).map(date => {
      return {
        date: Temporal.PlainDate.from(date),
        meals: groupedItems[date],
        orders: [],
        guestOrders: this.guestOrders
      }
    })

    this.data.sort((a, b) => Temporal.PlainDate.compare(a.date, b.date));
  }

  getIcon(categoryId: string): string {
    return this.categoryService.getCategory(categoryId)?.icon || '';
  }
}
