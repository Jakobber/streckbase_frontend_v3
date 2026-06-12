import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormGroup, FormControl, Validators, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faUser, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { ActionBarComponent } from "../../../shared/action-bar/action-bar.component";
import { ButtonComponent } from "../../../shared/button/button.component";
import { CheckboxComponent } from "../../../shared/checkbox/checkbox.component";
import { ModalComponent } from "../../../shared/modal/modal.component";
import { UserCardComponent } from "../../../shared/user-card/user-card.component";
import { AdminUsersService } from "./users.service";
import { User } from "../../../types/user";

@Component({
  selector: "app-admin-users",
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, FontAwesomeModule,
    ActionBarComponent, ButtonComponent, CheckboxComponent, ModalComponent, UserCardComponent
  ],
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class AdminUsersComponent implements OnInit {
  private currentUser: User;
  public lobare: User[] = [];
  public andra: User[] = [];
  public archivedUsers: User[] = [];
  public showArchivedUsers: boolean = false;
  public faUser: IconDefinition = faUser;
  public isNewUser: boolean = true;
  public showUserModal: boolean = false;
  public showPaymentInput: boolean = false;
  public paymentAmount: number | null = null;
  public showChargeInput: boolean = false;
  public chargeAmount: number | null = null;
  public loading: boolean = false;
  public modalTitle: string;
  public userForm = new FormGroup({
    firstname: new FormControl(""),
    lastname: new FormControl(""),
    id: new FormControl("", Validators.pattern(/\d{10}/)),
    email: new FormControl("", Validators.email),
    lobare: new FormControl(1),
    admin: new FormControl(false),
    debt: new FormControl({ value: 0, disabled: true }, Validators.pattern(/\d+/))
  });

  constructor(private usersService: AdminUsersService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getUsers();
    this.getArchivedUsers();
  }

  private getUsers() {
    this.usersService.getUsers()
      .subscribe((users: User[]) => {
        this.lobare = users.filter((u: User) => u.lobare === 1);
        this.andra = users.filter((u: User) => u.lobare !== 1).reverse();
        this.cdr.markForCheck();
      });
  }

  private getArchivedUsers() {
    this.usersService.getArchivedUsers()
      .subscribe((users: User[]) => {
        this.archivedUsers = users;
        this.cdr.markForCheck();
      });
  }

  disable() {
    if (!this.currentUser || this.loading) return;
    this.loading = true;
    this.usersService.disableUser(this.currentUser.id)
      .subscribe({
        next: () => {
          this.getUsers();
          this.getArchivedUsers();
          this.showUserModal = false;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => { this.loading = false; this.cdr.markForCheck(); }
      });
  }

  restoreUser(user: User) {
    this.usersService.restoreUser(user.id)
      .subscribe(() => {
        this.getUsers();
        this.getArchivedUsers();
        this.cdr.markForCheck();
      });
  }

  togglePaymentInput() {
    this.showPaymentInput = !this.showPaymentInput;
    if (!this.showPaymentInput) this.paymentAmount = null;
    this.showChargeInput = false;
    this.chargeAmount = null;
  }

  toggleChargeInput() {
    this.showChargeInput = !this.showChargeInput;
    if (!this.showChargeInput) this.chargeAmount = null;
    this.showPaymentInput = false;
    this.paymentAmount = null;
  }

  submitCharge() {
    if (!this.currentUser || this.loading || !this.chargeAmount || this.chargeAmount <= 0) return;
    this.loading = true;

    this.usersService.createCharge(this.currentUser.id, this.chargeAmount)
      .subscribe({
        next: () => {
          this.getUsers();
          this.showUserModal = false;
          this.showChargeInput = false;
          this.chargeAmount = null;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  submitRepayment() {
    if (!this.currentUser || this.loading || !this.paymentAmount || this.paymentAmount <= 0) return;
    this.loading = true;

    this.usersService.createRepayment(this.currentUser.id, this.paymentAmount)
      .subscribe({
        next: () => {
          this.getUsers();
          this.showUserModal = false;
          this.showPaymentInput = false;
          this.paymentAmount = null;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  toggleUserModal() {
    if (this.showUserModal) {
      this.showUserModal = false;
      this.showPaymentInput = false;
      this.paymentAmount = null;
      this.showChargeInput = false;
      this.chargeAmount = null;
      this.isNewUser = false;
    } else {
      this.userForm.reset({ lobare: 1 });
      this.currentUser = null;
      this.showPaymentInput = false;
      this.paymentAmount = null;
      this.showChargeInput = false;
      this.chargeAmount = null;
      this.userForm.get("debt").disable();
      this.userForm.get("firstname").enable();
      this.userForm.get("lastname").enable();
      this.userForm.get("id").enable();
      this.showUserModal = true;
      this.isNewUser = true;
    }
  }

  edit(user: User) {
    this.isNewUser = false;
    this.showPaymentInput = false;
    this.paymentAmount = null;
    this.showChargeInput = false;
    this.chargeAmount = null;
    this.currentUser = user;
    this.userForm.setValue({
      firstname: user.firstname,
      lastname: user.lastname,
      id: user.id,
      email: user.email,
      lobare: user.lobare,
      admin: user.admin,
      debt: user.debt
    });

    this.userForm.get("debt").enable();
    this.userForm.get("firstname").disable();
    this.userForm.get("lastname").disable();
    this.userForm.get("id").disable();
    this.showUserModal = true;
  }

  submit() {
    if (this.userForm.valid && this.userForm.dirty && !this.loading) {
      this.loading = true;
      const user: User = {
        ...this.currentUser,
        ...this.userForm.value,
        debt: this.userForm.value.debt != null ? Number(this.userForm.value.debt) : null,
        lobare: Number(this.userForm.value.lobare)
      };

      this.usersService.updateUser(user, this.isNewUser)
        .subscribe({
          next: () => {
            this.getUsers();
            this.getArchivedUsers();
            this.userForm.reset();
            this.showUserModal = false;
            this.loading = false;
            this.cdr.markForCheck();
          },
          error: () => {
            console.log("Some error occured when handling user");
            this.showUserModal = false;
            this.loading = false;
            this.cdr.markForCheck();
          }
        });
    } else {
      this.showUserModal = false;
    }
  }

}
