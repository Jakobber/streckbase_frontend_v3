import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

import { App } from "../../app";
import { ModalService } from "./modal.service";
import { ModalComponent } from "./modal.component";

@Component({
  selector: "app-modal-container",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modals-container" [class.to-front]="modals.length > 0">
      <div class="dim-background" (click)="close($event)"></div>
      <div *ngFor="let modal of modals; let i = index" class="modal-outer slideUp" [class.hidden]="i !== modals.length - 1">
        <ng-container *ngTemplateOutlet="modal.template"></ng-container>
      </div>
    </div>
  `,
  styleUrls: ["./modal.component.scss"]
})
export class ModalContainerComponent implements OnInit, OnDestroy {
  private modalsSubscription: Subscription;
  public modals: ModalComponent[] = [];

  constructor(private parent: App, private modalService: ModalService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.modalsSubscription = this.modalService.getModals()
      .subscribe((modals: ModalComponent[]) => {
        this.modals = modals;
        this.parent.blurred = this.modals.length > 0;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.modalsSubscription.unsubscribe();
  }

  close(event?: Event) {
    if (this.modals.length > 0) {
      const modal: ModalComponent = this.modals[this.modals.length - 1];

      if (modal.allowOutsideClick) {
        modal.toggle(false);
        modal.confirmClick(event);
      }
    }
  }

}
