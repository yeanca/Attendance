import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);

    // Check if the user is authenticated
    if (!authService.isAuth.value) {
        router.navigate(['/login']);
        return false;
    }

    return true; // Allow access if authenticated
};