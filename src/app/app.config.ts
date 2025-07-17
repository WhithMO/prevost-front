//-------------------------------------------------------------------------------//
//Configuracion del entorno(environments)
//-------------------------------------------------------------------------------//
import { HttpInterceptorFn } from '@angular/common/http';
import { HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

export const apiPrefixInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  if (!req.url.startsWith('http')) {
    const apiReq = req.clone({ url: `${environment.apiUrl}${req.url}` });
    return next(apiReq);
  }
  return next(req);
};

//-------------------------------------------------------------------------------//
//Configuracion del app.config
//-------------------------------------------------------------------------------//
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment.development';
import { FormsModule } from '@angular/forms';
import { LoginInterceptor } from './core/login.interceptor';
import { AuthGuard } from './core/guards/auth.guard';
import { FullCalendarModule } from '@fullcalendar/angular';
import { BsModalService, ModalModule } from 'ngx-bootstrap/modal';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    AuthGuard,
    provideHttpClient(withInterceptors([apiPrefixInterceptor])),
    provideHttpClient(withInterceptors([LoginInterceptor])),
    importProvidersFrom(FormsModule),
    importProvidersFrom(FullCalendarModule),
    importProvidersFrom(ModalModule.forRoot()),
    BsModalService
  ]
};