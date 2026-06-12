import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription, throwError } from "rxjs";
import { switchMap } from "rxjs/operators";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faChevronLeft, faCocktail, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { streckbaseConfig } from "../../app.config";
import { PrettyPricePipe } from "../../shared/pretty-price.pipe";
import { ActionBarComponent } from "../../shared/action-bar/action-bar.component";
import { ButtonComponent } from "../../shared/button/button.component";
import { HiddenInputComponent } from "../../shared/hidden-input/hidden-input.component";
import { ModalComponent } from "../../shared/modal/modal.component";
import { WrapperComponent } from "../../shared/wrapper/wrapper.component";
import { ItemService } from "./item.service";
import { Item } from "../../types/item";

@Component({
  selector: "app-item",
  standalone: true,
  imports: [
    CommonModule, FontAwesomeModule, PrettyPricePipe,
    ActionBarComponent, ButtonComponent, HiddenInputComponent,
    ModalComponent, WrapperComponent
  ],
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.scss"]
})
export class ItemComponent implements OnInit, OnDestroy {
  private routeSubscription: Subscription;
  public faChevronLeft: IconDefinition = faChevronLeft;
  public faCocktail: IconDefinition = faCocktail;
  private timer: any;
  public item: Item;
  public showErrorModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.setTimer();

    this.routeSubscription = this.route.params
      .pipe(
        switchMap((params: any) => {

          if (params.hasOwnProperty("id")) {
            return this.itemService.getItem(parseInt(params.id, 10));
          } else if (params.hasOwnProperty("barcode")) {
            return this.itemService.getBarcodeItem(params.barcode);
          } else {
            return throwError(() => new Error("Invalid parameters"));
          }

        })
      )
      .subscribe({
        next: (item: Item) => {
          this.showErrorModal = false;
          this.item = item;
          this.cdr.markForCheck();
        },
        error: (_err: any) => {
          this.showErrorModal = true;
          this.cdr.markForCheck();
        }
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
    this.timer = setTimeout(() => this.router.navigateByUrl("/"), streckbaseConfig.defaultTime);
  }

  onValueChange(barcode: string) {
    if (this.item && this.item.barcodes.some((b: string) => b === barcode)) {
      this.router.navigateByUrl("/");
    } else {
      this.router.navigate(["/items/barcodes", barcode]);
    }

    this.item = null;
  }

  goBack() {
    this.showErrorModal = false;
    setTimeout(() => this.router.navigateByUrl("/"));
  }
}
