import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink, NavigationEnd } from "@angular/router";
import { Subscription } from "rxjs";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"]
})
export class HeaderComponent implements OnInit, OnDestroy {
  private interval: number = 1000;
  private timer: any;
  private routeSubscription: Subscription;
  public isAdminRoute: boolean = false;
  public isHomeRoute: boolean = true;
  public currentTime: Date;

  constructor(private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.currentTime = new Date();
    this.routeSubscription = this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: NavigationEnd) => {
        this.isAdminRoute = /\/admin/.test(event.urlAfterRedirects);
        this.isHomeRoute = event.urlAfterRedirects === "/";
        this.cdr.markForCheck();
      });

    this.timer = setInterval(() => {
      this.currentTime = new Date();
      this.cdr.markForCheck();
    }, this.interval);
  }

  ngOnDestroy() {
    this.routeSubscription.unsubscribe();
    clearInterval(this.timer);
  }

}
