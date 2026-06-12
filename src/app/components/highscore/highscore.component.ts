import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { IconDefinition, faTrophy } from "@fortawesome/free-solid-svg-icons";

import { PrettyPricePipe } from "../../shared/pretty-price.pipe";
import { User } from "../../types/user";

@Component({
  selector: "app-highscore",
  standalone: true,
  imports: [CommonModule, FontAwesomeModule, PrettyPricePipe],
  templateUrl: "./highscore.component.html",
  styleUrls: ["./highscore.component.scss"]
})
export class HighscoreComponent {
  @Input() users: User[];
  public faTrophy: IconDefinition = faTrophy;
}
