import { Route } from "@angular/router";
import { HomeComponent } from "./user/home/home.component";
import { OrderComponent } from "./user/order/order.component";
import { HistoryComponent } from "./user/history/history.component";
import { OrderManagementComponent } from "./admin/order-management/order-management.component";

export const APP_ROUTES: Route[] = [
  {path: '', component: HomeComponent},
  {path: 'bestellen', component: OrderComponent},
  {path: 'historie', component: HistoryComponent},
  {path: 'bestellungsverwaltung', component: OrderManagementComponent},
];
