import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SY_ResponseStatus } from '../../../models/dto';
import { SpinnerService } from '../../../services/spinner.service';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-login-window',
  templateUrl: './login-window.component.html',
  styleUrl: './login-window.component.css',
})
export class LoginWindowComponent implements OnInit {
  loginForm: FormGroup;

  constructor(
    private _modalService: ModalService,
    private _account: AccountService,
    private _router: Router,
    private _fb: FormBuilder,
    public spinnerService: SpinnerService
  ) {
    this.loginForm = this._fb.group({
      email: ['jk@gmail.com', [Validators.required, Validators.email]],
      password: ['123', [Validators.required, Validators.minLength(3)]],
    });
  }

  ngOnInit() {}

  onLogin() {
    this.spinnerService.show();
    if (this.loginForm.valid) {
      this._account
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (result: SY_ResponseStatus) => {
            if (result.success) {
              this._router.navigate(['/main']);
            } else {
              this._modalService.showModal(result.message);
            }
          },
          error: (error) => {
            this._modalService.showModal(
              'Wystąpił błąd podczas próby logowania.'
            );
            console.error('Error during login: ', error);
            this.spinnerService.hide();
          },
          complete: () => {
            this.spinnerService.hide();
          },
        });
    } else {
      this.spinnerService.hide();
      this._modalService.showModal(
        'Niepoprawnie uzupełniony formularz logownia.'
      );
    }
  }
}
