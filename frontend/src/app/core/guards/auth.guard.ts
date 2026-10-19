import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Permite acceso únicamente a usuarios con rol 'admin'
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const usuario = authService.getUsuarioActual();

  if (usuario && usuario.rol?.toLowerCase() === 'admin') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

/**
 * Permite acceso a usuarios autenticados con rol 'usuario'
 */
export const userGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const usuario = authService.getUsuarioActual();

  if (usuario && usuario.rol?.toLowerCase() === 'usuario') {
    return true;
  }

  router.navigate(['/login']);
  return false;
};