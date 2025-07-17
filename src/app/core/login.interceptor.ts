import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoginService } from './services/login.service';

export const LoginInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(LoginService);
  const token = authService.obtenerToken();

  // Si hay un token, lo agregamos a la solicitud
  if (token) {
    const authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
    return next(authReq);
  }

  // Si no hay token, continuamos con la solicitud original
  return next(req);
};