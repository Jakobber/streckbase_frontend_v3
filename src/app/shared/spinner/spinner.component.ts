import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-spinner",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="show" class="loader">Loading...</div>
  `,
  styleUrls: ["./spinner.component.scss"]
})
export class SpinnerComponent {
  @Input() show: boolean = false;
}
