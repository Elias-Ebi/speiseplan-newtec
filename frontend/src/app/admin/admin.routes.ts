import { Route } from "@angular/router";
import { AdminComponent } from "./admin.component";

export const ADMIN_ROUTES: Route[] = [
  {path: '', component: AdminComponent},
  {path: '**', redirectTo: ''}
]
