import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../core/services/auth/auth.service';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const user = await authService.initializeAuth();
    console.log('Usuário autenticado:', user);
    const isAuthRoute = ['/login', '/register'].includes(state.url);

    if (user && isAuthRoute) {
      return router.createUrlTree(['/profile'])
    }

    if (!user) {
      console.log('Usuário não autenticado, redirecionando para /login...');
      return isAuthRoute ? true : router.createUrlTree(['/login']);
    }

    return true; 
  } catch (error) {
    console.error('Erro no guard:', error);
    return router.createUrlTree(['/login']);
  }
};
