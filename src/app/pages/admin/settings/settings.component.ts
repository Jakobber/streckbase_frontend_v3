import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";

import { ButtonComponent } from "../../../shared/button/button.component";
import { SettingsService, Multipliers } from "./settings.service";

@Component({
  selector: "app-admin-settings",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: "./settings.component.html",
  styleUrls: ["./settings.component.scss"]
})
export class SettingsComponent implements OnInit {
  public loading: boolean = false;
  public saved: boolean = false;
  public applied: boolean = false;
  public multipliersForm = new FormGroup({
    xlob: new FormControl(1.0, [Validators.required, Validators.min(0)]),
    andra: new FormControl(1.0, [Validators.required, Validators.min(0)]),
    najs: new FormControl(1.0, [Validators.required, Validators.min(0)])
  });

  constructor(private settingsService: SettingsService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.settingsService.getMultipliers()
      .subscribe((m: Multipliers) => {
        this.multipliersForm.setValue({ xlob: m.xlob, andra: m.andra, najs: m.najs });
        this.cdr.markForCheck();
      });
  }

  save() {
    if (this.multipliersForm.valid && !this.loading) {
      this.loading = true;
      this.saved = false;
      this.settingsService.updateMultipliers(this.multipliersForm.getRawValue())
        .subscribe(() => {
          this.loading = false;
          this.saved = true;
          this.cdr.markForCheck();
        });
    }
  }

  applyToAll() {
    if (this.multipliersForm.valid && !this.loading) {
      this.loading = true;
      this.applied = false;
      this.settingsService.applyMultipliers(this.multipliersForm.getRawValue())
        .subscribe(() => {
          this.loading = false;
          this.applied = true;
          this.cdr.markForCheck();
        });
    }
  }
}
