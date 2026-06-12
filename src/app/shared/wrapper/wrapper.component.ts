import { Component, Input } from "@angular/core";

@Component({
  selector: "app-wrapper",
  standalone: true,
  template: `
    <div class="scroll-container">
      <div class="wrapper" [class.footer-padding]="hasFooter">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styleUrls: ["./wrapper.component.scss"]
})
export class WrapperComponent {
  @Input() hasFooter: boolean = false;
}
