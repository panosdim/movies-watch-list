import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { TuiAlertService } from '@taiga-ui/core';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less'],
})
export class HomeComponent {
  constructor(
    private authService: AuthenticationService,
    private router: Router,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
