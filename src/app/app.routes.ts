import { Routes } from "@angular/router";

import { AddComponent } from "./pages/add/add.component";
import { FrontComponent } from "./pages/front/front.component";
import { ItemComponent } from "./pages/item/item.component";
import { PartyComponent } from "./pages/party/party.component";
import { UserComponent } from "./pages/user/user.component";
import { UsersComponent } from "./pages/users/users.component";

export const routes: Routes = [
  { path: "", component: FrontComponent },
  { path: "add", component: AddComponent },
  { path: "admin", loadChildren: () => import("./pages/admin/admin.routes").then(m => m.ADMIN_ROUTES) },
  { path: "items/:id", component: ItemComponent },
  { path: "items/barcodes/:barcode", component: ItemComponent },
  { path: "party", component: PartyComponent },
  { path: "users", component: UsersComponent },
  { path: "users/:id", component: UserComponent }
];
