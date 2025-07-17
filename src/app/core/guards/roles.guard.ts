import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../services/login.service';

export const rolesGuard: CanActivateFn = (route, state) => {
  const loginService = inject(LoginService);
  const router = inject(Router);

  const expectedRoles = route.data?.['roles'] as string[];
  const userRoles = loginService.getUserRoles();

  // 🔍 Log para depurar
  console.log('Roles requeridos:', expectedRoles);
  console.log('Roles del usuario:', userRoles);

  const hasRole = expectedRoles.some(role => userRoles.includes(role));

  if (!hasRole) {
    router.navigate(['/error']);
    return false;
  }

  return true;
};