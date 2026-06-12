import { inject } from "@angular/core";
import { Routes } from "@angular/router";

import { AdminComponent } from "./admin.component";
import { HistoryComponent } from "./history/history.component";
import { LoginComponent } from "./login/login.component";
import { ProductsComponent } from "./products/products.component";
import { AdminUsersComponent } from "./users/users.component";
import { SettingsComponent } from "./settings/settings.component";
import { AdminUsersService } from "./users/users.service";

export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    component: AdminComponent,
    canActivate: [() => inject(AdminUsersService).canActivate()],
    children: [
      { path: "", redirectTo: "users", pathMatch: "full" },
      { path: "users", component: AdminUsersComponent },
      { path: "products", component: ProductsComponent },
      { path: "history", component: HistoryComponent },
      { path: "settings", component: SettingsComponent }
    ]
  },
  { path: "login", component: LoginComponent }
];
