import { ApplicationConfig, LOCALE_ID, provideBrowserGlobalErrorListeners } from "@angular/core";
import { provideHttpClient } from "@angular/common/http";
import { provideRouter } from "@angular/router";
import { registerLocaleData } from "@angular/common";
import localeSv from "@angular/common/locales/sv";

import { routes } from "./app.routes";

registerLocaleData(localeSv, "sv");

// Zoneless (Angular 22 default). Async callbacks that mutate component state
// must call ChangeDetectorRef.markForCheck() — see ported components.
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(),
    { provide: LOCALE_ID, useValue: "sv" }
  ]
};

export interface IAppConfig {
  defaultTime: number;
}

export const streckbaseConfig: IAppConfig = {
  defaultTime: 20000
};
