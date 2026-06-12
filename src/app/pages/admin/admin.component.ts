import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { faTh, faUsers, faCog } from "@fortawesome/free-solid-svg-icons";

import { MenuComponent } from "../../components/menu/menu.component";
import { Link } from "../../components/menu/link";

@Component({
  selector: "app-admin",
  standalone: true,
  imports: [RouterOutlet, MenuComponent],
  templateUrl: "./admin.component.html",
  styleUrls: ["./admin.component.scss"]
})
export class AdminComponent {
  public links: Link[] = [
    {
      icon: faUsers,
      label: "Användare",
      route: "/admin/users"
    },
    {
      icon: faTh,
      label: "Produkter",
      route: "/admin/products"
    },
    {
      icon: faCog,
      label: "Inställningar",
      route: "/admin/settings"
    }
  ];
}
