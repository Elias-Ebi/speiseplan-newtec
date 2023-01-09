import { Route } from "@angular/router";
import { OverviewComponent } from "./overview/overview.component";
import { MonthoverviewComponent } from "./monthoverview/monthoverview.component";

export const ADMIN_ROUTES: Route[] = [
  {path: '', component: OverviewComponent},
  {path: 'month-overview', component: MonthoverviewComponent},
  {path: '**', redirectTo: ''}
]
