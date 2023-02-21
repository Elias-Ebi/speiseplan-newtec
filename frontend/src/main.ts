import { bootstrapApplication } from "@angular/platform-browser";
import { AppComponent } from "./app/app.component";
import { provideRouter } from "@angular/router";
import { APP_ROUTES } from "./app/app.routes";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { importProvidersFrom } from '@angular/core';
import localeDe from '@angular/common/locales/de';
import { registerLocaleData } from "@angular/common";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { AuthInterceptor } from "./app/shared/interceptors/auth.interceptor";
import { LoadingInterceptor } from "./app/shared/interceptors/loading.interceptor";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatDialogModule } from "@angular/material/dialog";

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(APP_ROUTES),
    importProvidersFrom([BrowserAnimationsModule, MatSnackBarModule, MatDialogModule]),
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true},
    provideHttpClient(withInterceptorsFromDi()),
  ]
});

// needed for german locale Data
registerLocaleData(localeDe);
