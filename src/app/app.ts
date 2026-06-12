import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterOutlet } from "@angular/router";

import { HeaderComponent } from "./components/header/header.component";
import { ModalContainerComponent } from "./shared/modal/modal-container.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, HeaderComponent, ModalContainerComponent],
  templateUrl: "./app.html",
  styleUrl: "./app.scss"
})
export class App implements OnInit {
  public blurred: boolean = false;

  constructor(private router: Router) { }

  ngOnInit() {
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      this.router.navigateByUrl("/party");
    }
  }
}
