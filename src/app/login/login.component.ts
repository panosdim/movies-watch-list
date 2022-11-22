import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  readonly loginForm = new FormGroup({
    email: new FormControl(``, [Validators.required, Validators.email]),
    password: new FormControl(``, Validators.required),
  });

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // TODO: Call Rest API to login
    const val = this.loginForm.value;

    if (val.email && val.password) {
      this.authService
        .login(val.email, val.password)
        .subscribe((user: User | undefined) => {
          if (user) {
            console.log(user);
            this.alertService
              .open(`${user.firstName} ${user.lastName}`, {
                label: `Welcome`,
                status: TuiNotification.Info,
              })
              .subscribe();
            // this.router.navigateByUrl('/home');
          }
        });
    }
  }
}
