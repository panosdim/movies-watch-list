import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}
  canActivate(
    _route: ActivatedRouteSnapshot,
    _state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.hasOwnProperty('exp') && decoded.exp * 1000 > Date.now()) {
          return true;
        }
        this.authService.logout();
        this.router.navigateByUrl('/login');
        return false;
      } catch {
        this.authService.logout();
        this.router.navigateByUrl('/login');
        return false;
      }
    }

    this.authService.logout();
    this.router.navigateByUrl('/login');
    return false;
  }
}
