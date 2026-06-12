import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

@Component({
  selector: "app-button",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./button.component.html",
  styleUrls: ["./button.component.scss"]
})
export class ButtonComponent {
  @Input() label?: string;
  @Input() modifiers: string | string[] = [];
  @Input() to?: string;
  @Input() disabled: boolean = false;
  @Input() type: string = "submit";

  constructor(private router: Router) { }

  onClick(_event: Event) {
    if (this.to && !this.disabled) {
      this.router.navigateByUrl(this.to);
    }
  }

}
