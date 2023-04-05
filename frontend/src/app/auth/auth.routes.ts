import { Route } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { ResetPasswordComponent } from "./reset-password/reset-password.component";
import { ResetApplyComponent } from "./reset-apply/reset-apply.component";
import { VerifyCodeComponent } from "./verify-code/verify-code.component";

export const AUTH_ROUTES: Route[] = [
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'reset', component: ResetPasswordComponent},
  {path: 'reset/:token', component: ResetApplyComponent},
  {path: 'verify-code', component: VerifyCodeComponent},
  {path: '**', redirectTo: 'login', pathMatch: 'full'},
];
