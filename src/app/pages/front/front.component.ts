import { ChangeDetectorRef, Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { Subscription } from "rxjs";
import { switchMap } from "rxjs/operators";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faUsers, faQuestion, IconDefinition, faTrophy } from "@fortawesome/free-solid-svg-icons";

import { ClockComponent } from "../../components/clock/clock.component";
import { FeedComponent } from "../../components/feed/feed.component";
import { HighscoreComponent } from "../../components/highscore/highscore.component";
import { ActionBarComponent } from "../../shared/action-bar/action-bar.component";
import { ButtonComponent } from "../../shared/button/button.component";
import { HiddenInputComponent } from "../../shared/hidden-input/hidden-input.component";
import { ModalComponent } from "../../shared/modal/modal.component";
import { FrontService } from "./front.service";
import { User } from "../../types/user";

@Component({
  selector: "app-front",
  standalone: true,
  imports: [
    CommonModule, RouterLink, FontAwesomeModule,
    ClockComponent, FeedComponent, HighscoreComponent,
    ActionBarComponent, ButtonComponent, HiddenInputComponent, ModalComponent
  ],
  templateUrl: "./front.component.html",
  styleUrls: ["./front.component.scss"]
})
export class FrontComponent implements OnInit, OnDestroy {
  private feedSubscription: Subscription;
  public faUsers: IconDefinition = faUsers;
  public faQuestion: IconDefinition = faQuestion;
  public faTrophy: IconDefinition = faTrophy;
  public showHelpModal: boolean = false;
  public feed: User[];
  public highscoreUsers: User[];

  constructor(private router: Router, private frontService: FrontService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.feedSubscription = this.frontService.getFeed()
      .pipe(
        switchMap((feed: User[]) => {
          this.feed = feed;
          this.cdr.markForCheck();
          return this.frontService.getHighscore();
        })
      )
      .subscribe((highscoreUsers: User[]) => {
        this.highscoreUsers = highscoreUsers;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy() {
    this.feedSubscription.unsubscribe();
  }

  onValueChange(value: string) {
    this.router.navigate(["/items/barcodes", value]);
  }

  onHelpClick(event?: Event) {
    // the whole front page is a routerLink to /users — don't let the click
    // bubble there, or navigation races the modal (v2 won that race via zone CD)
    event?.stopPropagation();
    this.showHelpModal = true;
  }
}
