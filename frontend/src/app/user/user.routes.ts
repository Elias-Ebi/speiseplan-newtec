import { HomeComponent } from "./home/home.component";
import { OrderComponent } from "./order/order.component";
import { HistoryComponent } from "./history/history.component";
import { Route } from "@angular/router";

export const USER_ROUTES: Route[] = [
  {path: '', component: HomeComponent},
  {path: 'bestellen', component: OrderComponent},
  {path: 'historie', component: HistoryComponent},
]
