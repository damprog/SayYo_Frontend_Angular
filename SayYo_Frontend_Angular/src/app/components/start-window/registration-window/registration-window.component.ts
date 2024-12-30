import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpinnerService } from '../../../services/spinner.service';
import { SY_ResponseStatus } from '../../../models/dto';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-registration-window',
  templateUrl: './registration-window.component.html',
  styleUrl: './registration-window.component.css',
})
export class RegistrationWindowComponent {
  registerForm: FormGroup;

  constructor(
    private _modalService: ModalService,
    private _account: AccountService,
    private _router: Router,
    private _fb: FormBuilder,
    public spinnerService: SpinnerService
  ) {
    this.registerForm = this._fb.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(3)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validator: passwordMatchValidator('password', 'confirmPassword'),
      }
    );
  }

  onRegister() {
    this.spinnerService.show();
    if (this.registerForm.valid) {
      this._account
        .register(
          this.registerForm.value.username,
          this.registerForm.value.email,
          this.registerForm.value.password
        )
        .subscribe({
          next: (result: SY_ResponseStatus) => {
            if (result.success) {
              this._router.navigate(['/main']);
              this._modalService.showModal(result.message);
            } else {
              this._modalService.showModal(result.message);
            }
          },
          error: (error) => {
            console.error('Error during registration..', error);
          },
          complete: () => {
            this.spinnerService.hide();
          },
        });
    } else {
      this.spinnerService.hide();
      this._modalService.showModal('Niepoprawnie uzupełniony formularz rejestracji.');
    }
  }
}

function passwordMatchValidator(
  password: string,
  confirmPassword: string
): any {
  return (formGroup: FormGroup) => {
    const passwordControl = formGroup.controls[password];
    const confirmPasswordControl = formGroup.controls[confirmPassword];

    if (!passwordControl || !confirmPasswordControl) return null;

    if (
      confirmPasswordControl.errors &&
      !confirmPasswordControl.errors['passwordMismatch']
    ) {
      return null;
    }

    if (passwordControl.value !== confirmPasswordControl.value) {
      confirmPasswordControl.setErrors({ passwordMismatch: true });
    } else {
      confirmPasswordControl.setErrors(null);
    }

    return null;
  };
}
