import { ChangeDetectorRef, Component, Output, ViewChild, HostListener, EventEmitter } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AutofocusDirective } from "../auto-focus.directive";

@Component({
  selector: "app-hidden-input",
  standalone: true,
  imports: [CommonModule, FormsModule, AutofocusDirective],
  template: `
    <input
      appAutofocus
      [(ngModel)]="barcode"
      (keyup.enter)="onChange()" />

    <div *ngIf="flashing" class="flash"></div>
  `,
  styleUrls: ["./hidden-input.component.scss"]
})
export class HiddenInputComponent {
  @ViewChild(AutofocusDirective) autofocus: AutofocusDirective;
  @Output() onValueChange: EventEmitter<string> = new EventEmitter<string>();
  private flashTime: number = 100;
  public barcode: string;
  public flashing: boolean = false;

  constructor(private cdr: ChangeDetectorRef) { }

  @HostListener("document:click")
  onDocumentClick() {
    if (this.autofocus) {
      this.autofocus.focus();
    }
  }

  onChange() {
    if (this.barcode && !this.flashing) {
      this.flashing = true;
      this.onValueChange.emit(this.barcode);

      setTimeout(() => {
        this.barcode = "";
        this.flashing = false;
        this.cdr.markForCheck();
      }, this.flashTime);
    }
  }

}
