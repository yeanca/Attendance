import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.user$.subscribe((user) => {
    if (user) {
      authService.currentuserSignal.set({
        email: user.email!,
        displayName: user.displayName!,
      });
    } else {
    authService.currentuserSignal.set(null);
    }
  });
  let user = authService.currentuserSignal().displayName;

  return authService.getUserRole(user).pipe(
    map((user) => {
      if (user && user.role === 'Admin') {
        return true; // Allow access if the user is Admin
      } else {
        router.navigate(['/not-authorized']); // Redirect to not-authorized
        return false;
      }
    }),
    catchError((error) => {
      console.error('Error checking user role:', error);
      router.navigate(['/not-authorized']); // Redirect on error
      return of(false); // Deny access
    })
  );
};