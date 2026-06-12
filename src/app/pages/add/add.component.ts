import { ChangeDetectorRef, Component, OnDestroy, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { AddService } from "./add.service";
import { ImageService } from "../../core/image.service";
import { SystembolagetItem } from "./systembolaget-item";

@Component({
  selector: "app-add",
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: "./add.component.html",
  styleUrls: ["./add.component.scss"]
})
export class AddComponent implements OnDestroy {
  @ViewChild("queryForm") queryForm: NgForm;
  private systembolagetSubscription: Subscription;
  public query: string = "1491";
  public item: SystembolagetItem;
  public itemImage: string;

  constructor(private addService: AddService, private imageService: ImageService, private cdr: ChangeDetectorRef) { }

  ngOnDestroy() {
    if (this.systembolagetSubscription) {
      this.systembolagetSubscription.unsubscribe();
    }
  }

  onSearch() {
    if (this.queryForm.valid) {
      this.systembolagetSubscription = this.addService.getSystembolagetMetadata(this.query)
        .subscribe((item: SystembolagetItem) => {
          this.item = item;
          this.cdr.markForCheck();

          if (item.imageUrl) {
            this.imageService.convertImage(item.imageUrl)
              .then((image: string) => {
                this.itemImage = image;
                this.cdr.markForCheck();
              })
              .catch(e => console.log(e));
          }
        });
    }
  }

}
