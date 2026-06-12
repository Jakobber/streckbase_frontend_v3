import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { streckbaseConfig } from "../../app.config";
import { ActionBarComponent } from "../../shared/action-bar/action-bar.component";
import { ButtonComponent } from "../../shared/button/button.component";
import { HiddenInputComponent } from "../../shared/hidden-input/hidden-input.component";
import { UserCardComponent } from "../../shared/user-card/user-card.component";
import { WrapperComponent } from "../../shared/wrapper/wrapper.component";
import { UsersService } from "./users.service";
import { User } from "../../types/user";

@Component({
  selector: "app-users",
  standalone: true,
  imports: [
    CommonModule, RouterLink, FontAwesomeModule,
    ActionBarComponent, ButtonComponent, HiddenInputComponent,
    UserCardComponent, WrapperComponent
  ],
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit, OnDestroy {
  private timer: any;
  public lobare: User[];
  public xlobare: User[];
  public faChevronLeft: IconDefinition = faChevronLeft;

  constructor(private router: Router, private usersService: UsersService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.setTimer();

    this.usersService.getUsers()
      .subscribe((users: User[]) => {
        this.lobare = users.filter((user: User) => user.lobare === 1);
        this.xlobare = users.filter((user: User) => user.lobare !== 1).reverse();
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private setTimer() {
    this.timer = setTimeout(() => this.router.navigateByUrl("/"), streckbaseConfig.defaultTime);
  }

  onValueChange(barcode: string) {
    this.router.navigate(["/items/barcodes", barcode]);
  }

}
