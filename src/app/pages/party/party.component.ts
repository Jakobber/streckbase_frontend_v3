import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";

import { FeedComponent } from "../../components/feed/feed.component";
import { WrapperComponent } from "../../shared/wrapper/wrapper.component";
import { FrontService } from "../front/front.service";
import { User } from "../../types/user";

@Component({
  selector: "app-party",
  standalone: true,
  imports: [CommonModule, FeedComponent, WrapperComponent],
  templateUrl: "./party.component.html",
  styleUrls: ["./party.component.scss"]
})
export class PartyComponent implements OnInit, OnDestroy {
  private feedSubscription: Subscription;
  public feed: User[];

  constructor(private frontService: FrontService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.feedSubscription = this.frontService.getFeed()
      .subscribe((feed: User[]) => {
        this.feed = feed;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.feedSubscription.unsubscribe();
  }
}
