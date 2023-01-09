import { Route } from "@angular/router";

export const APP_ROUTES: Route[] = [
  {
    path: '',
    loadComponent: () => import('./user/user.component').then(m => m.UserComponent),
    loadChildren: () => import('./user/user.routes').then(m => m.USER_ROUTES)
  },
  {
    path: 'auth',
    loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent),
    loadChildren: () => import('./auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {path: '**', redirectTo: '', pathMatch: 'full'}
];
