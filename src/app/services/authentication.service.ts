import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { of } from 'rxjs';
import { catchError, map, shareReplay } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private user: User | undefined;
  constructor(
    private http: HttpClient,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {}

  login(email: string, password: string) {
    return this.http
      .post<User>(environment.loginUrl(), {
        email: email.trim(),
        password: password.trim(),
      })
      .pipe(
        map((res: any) => {
          // login successful if there's a jwt token in the response
          if (res && res.token) {
            // store user and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem('token', res.token);
            this.user = res.user;
          }
          return this.user;
        })
      )
      .pipe(
        catchError((_err) => {
          this.alertService
            .open(`Please check your email and password`, {
              label: `Login Failed`,
              status: TuiNotification.Error,
            })
            .subscribe();
          return of();
        })
      )
      .pipe(shareReplay());
  }

  logout() {
    localStorage.removeItem('token');
    this.user = undefined;
  }

  public isLoggedIn() {
    return this.user != undefined;
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }
}
