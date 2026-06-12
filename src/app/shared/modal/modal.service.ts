import { Injectable } from "@angular/core";
import { Observable, ReplaySubject } from "rxjs";

import { ModalComponent } from "./modal.component";

@Injectable({ providedIn: "root" })
export class ModalService {
  private modalsSubject = new ReplaySubject<ModalComponent[]>(1);
  private modalsQueue: ModalComponent[] = [];

  open(modal: ModalComponent) {
    this.modalsQueue.push(modal);
    this.modalsSubject.next(this.modalsQueue);
  }

  getModals(): Observable<ModalComponent[]> {
    return this.modalsSubject.asObservable();
  }

  close(currentModal?: ModalComponent) {
    if (currentModal) {
      const index = this.modalsQueue.findIndex((modal: ModalComponent) => modal === currentModal);
      if (index > -1) {
        this.modalsQueue.splice(index, 1);
      }
    } else {
      this.modalsQueue.pop();
    }

    this.modalsSubject.next(this.modalsQueue);
  }

  closeAll() {
    this.modalsQueue = [];
    this.modalsSubject.next(this.modalsQueue);
  }

}
