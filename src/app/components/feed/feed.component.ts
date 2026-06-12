import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PrettyDatePipe } from "../../shared/pretty-date.pipe";
import { SpinnerComponent } from "../../shared/spinner/spinner.component";
import { User } from "../../types/user";

@Component({
  selector: "app-feed",
  standalone: true,
  imports: [CommonModule, PrettyDatePipe, SpinnerComponent],
  templateUrl: "./feed.component.html",
  styleUrls: ["./feed.component.scss"]
})
export class FeedComponent {
  @Input() feed: User[];
}
