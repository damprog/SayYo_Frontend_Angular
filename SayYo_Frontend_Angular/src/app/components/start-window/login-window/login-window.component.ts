import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SY_ResponseStatus } from '../../../models/dto';
import { SpinnerService } from '../../../services/spinner.service';

@Component({
  selector: 'app-login-window',
  templateUrl: './login-window.component.html',
  styleUrl: './login-window.component.css',
})
export class LoginWindowComponent {
  loginForm: FormGroup;

  constructor(
    private _account: AccountService,
    private _router: Router,
    private _fb: FormBuilder,
    public spinnerService: SpinnerService
  ) {
    this.loginForm = this._fb.group({
      email: ['asd@gmail.com', [Validators.required, Validators.email]],
      password: ['asd', [Validators.required, Validators.minLength(3)]],
    });
  }

  onLogin() {
    this.spinnerService.show();
    if (this.loginForm.valid) {
      this._account
        .login(this.loginForm.value.email, this.loginForm.value.password)
        .subscribe({
          next: (result: SY_ResponseStatus) => {
            if (result.success) {
              console.log("Test2");
              this._router.navigate(['/main']);
            } else {
              alert(result.message);
            }
          },
          error: (error) => {
            alert('Wystąpił błąd podczas próby logowania.');
            console.error('Error during login: ', error);
            this.spinnerService.hide();
          },
          complete: () => {
            this.spinnerService.hide();
          },
        });
    } else {
      this.spinnerService.hide();
      alert('Niepoprawnie uzupełniony formularz logownia.');
    }
  }
}
