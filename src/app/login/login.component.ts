import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MovieType, PopularMoviesType } from '../models/movie';
import { User } from '../models/user';
import { AuthenticationService } from '../services/authentication.service';
import { PopularService } from '../services/popular.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  readonly loginForm = new FormGroup({
    email: new FormControl(``, [Validators.required, Validators.email]),
    password: new FormControl(``, Validators.required),
  });
  popularMovies!: Observable<MovieType[]>;
  imageBaseUrl = environment.imageBaseUrl + 'w185';

  constructor(
    private authService: AuthenticationService,
    private router: Router,
    private popularService: PopularService,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  ngOnInit(): void {
    this.popularMovies = this.popularService
      .getPopularMovies()
      .pipe(map((resp: PopularMoviesType) => <MovieType[]>resp.results));
  }

  login() {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const val = this.loginForm.value;

    if (val.email && val.password) {
      this.authService
        .login(val.email, val.password)
        .subscribe((user: User | undefined) => {
          if (user) {
            this.alertService
              .open(`${user.firstName} ${user.lastName}`, {
                label: `Welcome`,
                status: TuiNotification.Info,
              })
              .subscribe();
            this.router.navigate(['home']);
          }
        });
    }
  }
}
