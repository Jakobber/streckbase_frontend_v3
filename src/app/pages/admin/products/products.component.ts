import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UntypedFormGroup, UntypedFormControl, Validators, AbstractControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faPlus, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { ActionBarComponent } from "../../../shared/action-bar/action-bar.component";
import { ButtonComponent } from "../../../shared/button/button.component";
import { CheckboxComponent } from "../../../shared/checkbox/checkbox.component";
import { ModalComponent } from "../../../shared/modal/modal.component";
import { ProductsService } from "./products.service";
import { SettingsService, Multipliers } from "../settings/settings.service";
import { Item } from "../../../types/item";

const EAN_7: RegExp = /\d{7}/;

function ValidateBarcodes(c: AbstractControl) {
  if (c && c.value) {
    const array = c.value.split(",");
    const valid: boolean = array.every((value: string) => EAN_7.test(value) && value.trim().length >= 7);

    if (!valid) {
      return {
        validateBarcodes: true
      }
    }
  }

  return null;
}

@Component({
  selector: "app-admin-products",
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule,
    ActionBarComponent, ButtonComponent, CheckboxComponent, ModalComponent
  ],
  templateUrl: "./products.component.html",
  styleUrls: ["./products.component.scss"]
})
export class ProductsComponent implements OnInit {
  private currentItem: Item;
  private allItems: Item[] = [];
  private archivedItems: Item[] = [];
  public items: Item[];
  public archived: Item[];
  public faPlus: IconDefinition = faPlus;
  public query: string;
  public isNewItem: boolean = true;
  public showItemModal: boolean = false;
  public showArchived: boolean = false;
  public loading: boolean = false;
  private multipliers: Multipliers = { xlob: 1.0, andra: 1.0, najs: 1.0 };
  public itemForm = new UntypedFormGroup({
    name: new UntypedFormControl(""),
    price: new UntypedFormControl(""),
    price_xlob: new UntypedFormControl(""),
    price_andra: new UntypedFormControl(""),
    price_najs: new UntypedFormControl(""),
    volume: new UntypedFormControl("", Validators.pattern(/\d+/)),
    alcohol: new UntypedFormControl(""),
    barcodes: new UntypedFormControl("", [Validators.required, ValidateBarcodes]),
    imageUrl: new UntypedFormControl({ value: "", disabled: true }),
    exclude_from_highscore: new UntypedFormControl(false)
  });

  constructor(private productsService: ProductsService, private settingsService: SettingsService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getItems();
    this.getArchivedItems();
    this.settingsService.getMultipliers().subscribe((m: Multipliers) => {
      this.multipliers = m;
    });
    this.itemForm.get("price").valueChanges.subscribe((price: number) => {
      if (this.isNewItem && price > 0) {
        this.itemForm.patchValue({
          price_xlob: Math.round(price * this.multipliers.xlob),
          price_andra: Math.round(price * this.multipliers.andra),
          price_najs: Math.round(price * this.multipliers.najs)
        }, { emitEvent: false });
      }
    });
  }

  private getItems() {
    this.productsService.getItems()
      .subscribe((items: Item[]) => {
        this.allItems = items;
        this.items = items;
        this.cdr.markForCheck();
      });
  }

  private getArchivedItems() {
    this.productsService.getArchivedItems()
      .subscribe((items: Item[]) => {
        this.archivedItems = items;
        this.archived = items;
        this.cdr.markForCheck();
      });
  }

  filter() {
    const keys = ["id", "name", "price"];

    this.items = this.allItems
      .filter((item: Item) => keys
        .some((key: string) => item[key].toString().toLowerCase().indexOf(this.query) > -1));
  }

  toggleItemModal() {
    this.currentItem = null;
    this.itemForm.reset();
    this.showItemModal = !this.showItemModal;
    this.isNewItem = this.showItemModal;
  }

  edit(item: Item) {
    this.isNewItem = false;
    this.currentItem = item;
    this.itemForm.setValue({
      name: item.name,
      price: item.price,
      price_xlob: item.price_xlob,
      price_andra: item.price_andra,
      price_najs: item.price_najs,
      alcohol: item.alcohol,
      barcodes: item.barcodes.join(", "),
      volume: item.volume,
      imageUrl: item.imageUrl,
      exclude_from_highscore: !!item.exclude_from_highscore
    });

    this.showItemModal = true;
  }

  private checkDuplicates(item: Item): string | null {
    for (const barcode of item.barcodes) {
      const inActive = this.allItems.find(i => i.id !== item.id && i.barcodes && i.barcodes.includes(barcode));
      if (inActive) return `Streckkod ${barcode} finns redan i Produkter`;
      const inArchived = this.archivedItems.find(i => i.barcodes && i.barcodes.includes(barcode));
      if (inArchived) return `Streckkod ${barcode} finns redan i Arkiverade produkter`;
    }
    const nameInActive = this.allItems.find(i => i.id !== item.id && i.name.toLowerCase() === item.name.toLowerCase());
    if (nameInActive) return `"${item.name}" finns redan i Produkter`;
    const nameInArchived = this.archivedItems.find(i => i.name.toLowerCase() === item.name.toLowerCase());
    if (nameInArchived) return `"${item.name}" finns redan i Arkiverade produkter`;
    return null;
  }

  submit() {
    if (this.itemForm.valid && this.itemForm.dirty && !this.loading) {
      this.loading = true;
      const item: Item = {
        ...this.currentItem,
        ...this.itemForm.value,
        barcodes: this.itemForm.value.barcodes.split(",").map((b: string) => b.trim())
      };

      if (this.isNewItem) {
        const conflict = this.checkDuplicates(item);
        if (conflict) {
          window.alert(conflict);
          this.loading = false;
          return;
        }
      }

      this.productsService.updateItem(item, this.isNewItem)
        .subscribe({
          next: () => {
            this.getItems();
            this.getArchivedItems();
            this.itemForm.reset();
            this.showItemModal = false;
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: () => {
            this.showItemModal = false;
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
    } else {
      this.showItemModal = false;
    }
  }

  restore(item: Item) {
    this.productsService.restoreItem(item)
      .subscribe(() => {
        this.getItems();
        this.getArchivedItems();
        this.cdr.markForCheck();
      });
  }

  delete($event: any) {
    $event.preventDefault();
    this.productsService.deleteItem(this.currentItem)
      .subscribe({
        next: () => {
          this.getItems();
          this.getArchivedItems();
          this.showItemModal = false;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.showItemModal = false;
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

}
