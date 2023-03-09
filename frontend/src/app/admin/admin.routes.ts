import { Route } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { MonthoverviewComponent } from './monthoverview/monthoverview.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { DishesComponent } from './dishes/dishes.component';
import { UsersComponent } from './users/users.component';
import { AdminSettingsComponent } from './admin-settings/admin-settings.component';

export const ADMIN_ROUTES: Route[] = [
  { path: '', component: OverviewComponent },
  { path: 'month-overview', component: MonthoverviewComponent },
  { path: 'order-management', component: OrderManagementComponent },
  { path: 'settings', component: AdminSettingsComponent},
  { path: 'user-management', component: UsersComponent },
  { path: 'dish-management', component: DishesComponent },
  { path: '**', redirectTo: '' },
];
