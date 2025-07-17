import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

interface LoginResponse {
  token: string;
  rol: string;
  usuario: string;
  idProfesor: string;
  primerIngreso: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private apiUrl = '/api/auth/login';
  private tokenKey = 'authToken';
  private rolKey = 'userRol';
  private usuarioKey = 'username';
  private codigoprofesorKey = 'codprofesor';

  constructor(private http: HttpClient) { }

  login(usuario: string, contraseña: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl, { usuario, contraseña }).pipe(
      tap(response => console.log('Respuesta del backend:', response)),
      catchError(error => {
        console.error('Error completo en la solicitud de login:', error);

        return throwError(() => error);
      })
    );
  }

  cambiarClave(data: {
    usuario: string;
    claveActual: string;
    nuevaClave: string;
  }): Observable<any> {
    return this.http.put('/api/auth/actualizarclave', data).pipe(
      tap(res => console.log('✅ Clave cambiada correctamente:', res)),
      catchError(error => {
        console.error('❌ Error al cambiar la clave:', error);
        return throwError(() => error);
      })
    );
  }
  
  guardarDatosDeSesion(token: string, rol: string, usuario: string, codprofesor: string): void {
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.rolKey, rol);
    localStorage.setItem(this.usuarioKey, usuario);
    localStorage.setItem(this.codigoprofesorKey, codprofesor);
  }

  obtenerToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  obtenerUsuario(): string | null {
    return localStorage.getItem(this.usuarioKey);
  }

  obtenerRol(): string | null {
    return localStorage.getItem(this.rolKey);
  }

  obtenerCodProfesor(): string | null {
    return localStorage.getItem(this.codigoprofesorKey);
  }

  cerrarSesion(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.rolKey);
    localStorage.removeItem(this.usuarioKey);
    localStorage.removeItem(this.codigoprofesorKey);
  }

  isLoggedIn(): boolean {
    const token = this.obtenerToken();
    return !!token;
  }

  isAdmin(): boolean {
    return this.obtenerRol() === 'ADMINISTRADOR';
  }

  isProfessor(): boolean {
    return this.obtenerRol() === 'PROFESOR';
  }

  hasAccess(): boolean {
    return this.isAdmin() || this.isProfessor();
  }

  getUserRoles(): string[] {
    const rol = localStorage.getItem(this.rolKey);
    return rol ? [rol] : [];
  }
  
}