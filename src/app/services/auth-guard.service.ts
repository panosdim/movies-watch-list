import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AuthenticationService } from './authentication.service';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);
  const token = localStorage.getItem('token');

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      if (decoded.hasOwnProperty('exp') && decoded.exp * 1000 > Date.now()) {
        return true; // The token is valid
      }
      authService.logout();
      router.navigateByUrl('/login');
      return false; // Token has expired
    } catch {
      authService.logout();
      router.navigateByUrl('/login');
      return false; // Token decoding failed
    }
  }

  authService.logout();
  router.navigateByUrl('/login');
  return false; // No token, not authenticated
};
