import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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

  login() {
    console.log(this.loginForm);
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // TODO: Call Rest API to login
  }
}
