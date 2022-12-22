import { Route } from "@angular/router";
import { HomeComponent } from "./user/home/home.component";
import { OrderComponent } from "./user/order/order.component";
import { HistoryComponent } from "./user/history/history.component";
import { UsersComponent } from "./admin/users/users.component";
import {LoginComponent} from "./shared/login/login.component";
import {DishesComponent} from "./admin/dishes/dishes.component";

export const APP_ROUTES: Route[] = [
  {path: '', component: HomeComponent},
  {path: 'bestellen', component: OrderComponent},
  {path: 'historie', component: HistoryComponent},
  {path: 'nutzer', component: UsersComponent},
  {path: 'login', component: LoginComponent},
  {path: 'gerichte', component: DishesComponent}
];
