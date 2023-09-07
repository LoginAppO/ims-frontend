import { Component } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';
import { catchError, tap } from 'rxjs/operators';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null): boolean {
    return !!(control && control.invalid && (control.dirty || control.touched || control.hasError('email')));
  }
}

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (value.length < 6) {
      return { minLength: true };
    }

    if (!/[A-Z]/.test(value)) {
      return { noUppercase: true };
    }

    if (!/\d/.test(value)) {
      return { noDigit: true };
    }

    return null; // Validation passed
  };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  emailFormControl = new FormControl('', [Validators.required, Validators.email]);

  passwordFormControl = new FormControl('', [Validators.required, passwordValidator()]);

  matcher = new MyErrorStateMatcher();

  loginError: boolean = false;

  constructor(
    private loginService: LoginService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.navigate(['/users']);
    }
  }

  onClick() {
    if (this.emailFormControl.valid && this.passwordFormControl.valid) {
      const emailValue = this.emailFormControl.value;
      const passwordValue = this.passwordFormControl.value;
      if (emailValue !== null && passwordValue !== null) {
        this.loginService
          .login(emailValue, passwordValue)
          .pipe(
            tap((response) => {
              if (response.statusCode === 'OK') {
                localStorage.setItem('token', response.data.token);
                this.router.navigate(['']);
                window.location.reload();
              }
            }),
            catchError(() => {
              this.loginError = true;
              return [];
            }),
          )
          .subscribe();
      }
    }
  }
}
