import { Route } from '@angular/router';
import { OverviewComponent } from './overview/overview.component';
import { MonthOverviewComponent } from './month-overview/month-overview.component';
import { OrderManagementComponent } from './order-management/order-management.component';
import { MealManagementComponent } from './meal-management/meal-management.component';
import { AdminManagementComponent } from './admin-management/admin-management.component';

export const ADMIN_ROUTES: Route[] = [
  {path: '', component: OverviewComponent},
  {path: 'month-overview', component: MonthOverviewComponent},
  {path: 'order-management', component: OrderManagementComponent},
  {path: 'meal-management', component: MealManagementComponent},
  {path: 'admin-management', component: AdminManagementComponent},
  {path: '**', redirectTo: ''}
];
