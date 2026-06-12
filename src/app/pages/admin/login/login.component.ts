import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from "@angular/forms";

import { ButtonComponent } from "../../../shared/button/button.component";
import { User } from "../../../types/user";
import { AdminUsersService } from "../users/users.service";

@Component({
  selector: "app-admin-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  public loading: boolean = false;
  public loginForm = new FormGroup({
    id: new FormControl("", [Validators.required, Validators.pattern(/\d{10}/)]),
  });

  constructor(private usersService: AdminUsersService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    if (this.usersService.canActivate()) {
      this.router.navigate(["/admin"]);
    }
  }

  submit() {
    if (!this.loading && this.loginForm.valid) {
      const id: string = this.loginForm.value.id;
      this.loading = true;
      this.usersService.getUser(id)
        .subscribe({
          next: (user: User) => {
            if (!user.admin) {
              console.log("User doesn't have admin access");
            } else {
              this.usersService.setLoggedInUser(user);
              this.router.navigate(["/admin"]);
            }
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: () => {
            console.log("Unable to find user");
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
    }
  }
}
