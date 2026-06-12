import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { ActivatedRoute, Params, Router } from "@angular/router";
import { Subscription, throwError } from "rxjs";
import { switchMap } from "rxjs/operators";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faUndo, faQuestion, faTimes, faCheck, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { streckbaseConfig } from "../../app.config";
import { PrettyDatePipe } from "../../shared/pretty-date.pipe";
import { PrettyPricePipe } from "../../shared/pretty-price.pipe";
import { ActionBarComponent } from "../../shared/action-bar/action-bar.component";
import { ButtonComponent } from "../../shared/button/button.component";
import { HiddenInputComponent } from "../../shared/hidden-input/hidden-input.component";
import { ModalComponent } from "../../shared/modal/modal.component";
import { UserCardComponent } from "../../shared/user-card/user-card.component";
import { WrapperComponent } from "../../shared/wrapper/wrapper.component";
import { ItemService } from "../item/item.service";
import { UserService } from "./user.service";

import { Item } from "../../types/item";
import { Purchase } from "../../types/purchase";
import { User } from "../../types/user";

@Component({
  selector: "app-user",
  standalone: true,
  imports: [
    CommonModule, FontAwesomeModule, PrettyDatePipe, PrettyPricePipe,
    ActionBarComponent, ButtonComponent, HiddenInputComponent,
    ModalComponent, UserCardComponent, WrapperComponent
  ],
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.scss"]
})
export class UserComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  private timer: any;
  private debtTreshold: number = 2000;
  private undoTreshold: number = 864000000; // 1 day in ms;
  public user: User;
  public kindMessage: string;
  public errorMessage: string;
  public showDebtWarning: boolean = false;
  public showError: boolean = false;
  public showUndoConfirmation: boolean = false;
  public showHelpModal: boolean = false;
  public dateValid: boolean = false;
  public purchaseItem: Purchase;
  public najsMode: boolean = false;
  public faChevronLeft = faChevronLeft;
  public faUndo: IconDefinition = faUndo;
  public faQuestion: IconDefinition = faQuestion;
  public faTimes: IconDefinition = faTimes;
  public faCheck: IconDefinition = faCheck;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.setTimer();

    this.routeSubscription = this.route.params
      .pipe(
        switchMap((params: Params) => {
          return this.userService.getUser(params.id);
        })
      )
      .subscribe((user: User) => {
        this.user = user;
        this.showDebtWarning = this.user.debt >= this.debtTreshold;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.clearTimer();
    this.routeSubscription.unsubscribe();
  }

  private clearTimer() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private setTimer() {
    this.timer = setTimeout(() => {
      this.showHelpModal = false;
      this.showUndoConfirmation = false;
      this.showError = false;
      this.showDebtWarning = false;
      this.cdr.markForCheck();
      setTimeout(() => this.router.navigateByUrl("/"));
    }, streckbaseConfig.defaultTime);
  }

  toggleNajs() {
    this.clearTimer();
    this.setTimer();
    this.najsMode = !this.najsMode;
  }

  buy(barcode: string) {
    this.clearTimer();
    this.setTimer();
    this.purchaseItem = null;
    this.dateValid = false;
    this.showUndoConfirmation = false;
    const isNajs = this.najsMode;
    this.najsMode = false;

    this.itemService.getBarcodeItem(barcode)
      .pipe(
        switchMap((item: Item) => {
          if (!item) return throwError(() => new Error("No matching item"));

          return this.userService.purchaseItem(this.user.id, item, isNajs);
        }),
        switchMap(() => this.userService.getUser(this.user.id))
      )
      .subscribe({
        next: (user: User) => {
          this.user = user;
          this.cdr.markForCheck();
        },
        error: (_err: HttpErrorResponse) => {
          this.kindMessage = "Köpet kunde inte genomföras för att artikeln inte finns i systemet";
          this.showError = true;
          this.cdr.markForCheck();
        }
      });
  }

  selectPurchase(purchase: Purchase) {
    this.purchaseItem = purchase;
    this.dateValid = new Date().getTime() - new Date(purchase.date).getTime() <= this.undoTreshold;
  }

  undoClick() {
    this.clearTimer();
    this.showUndoConfirmation = true;
  }

  undoPurchase() {
    this.userService.deletePurchase(this.user.id, this.purchaseItem.id)
      .pipe(
        switchMap(() => {
          return this.userService.getUser(this.user.id);
        })
      )
      .subscribe({
        next: (user: User) => {
          this.user = user;
          this.cdr.markForCheck();
        },
        error: (err: HttpErrorResponse) => {
          this.kindMessage = "Köpet kunde inte ångras";
          this.errorMessage = err.message;
          this.showError = true;
          this.cdr.markForCheck();
        }
      });

    this.dateValid = false;
    this.purchaseItem = null;
    this.showUndoConfirmation = false;
    this.setTimer();
  }

  toggleHelpModal() {
    this.clearTimer();
    this.setTimer();
    this.showHelpModal = true;
  }

}
