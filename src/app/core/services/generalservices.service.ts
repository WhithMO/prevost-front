import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class GeneralservicesService<T> {

  constructor(protected http: HttpClient, @Inject(String) protected apiUrl: string) {}

    listar(): Observable<T[]> {
      return this.http.get<T[]>(`${environment.apiUrl}${this.apiUrl}/listar`);
    }
  
    buscar(id: string): Observable<T> {
      return this.http.get<T>(`${environment.apiUrl}${this.apiUrl}/buscar/${id}`);
    }

    buscaridNumber(id: Number): Observable<T> {
      return this.http.get<T>(`${environment.apiUrl}${this.apiUrl}/buscar/${id}`);
    }
  
    agregar(data: T): Observable<T> {
      return this.http.post<T>(`${environment.apiUrl}${this.apiUrl}/agregar`, data);
    }

    agregarLista(data: T | T[]): Observable<T | T[]> {
      return this.http.post<T | T[]>(`${environment.apiUrl}${this.apiUrl}/agregar`, data);
    }
    
  
    editar(id: number, data: T): Observable<T> {
      return this.http.put<T>(`${environment.apiUrl}${this.apiUrl}/editar/${id}`, data);
    }

    editaridtexto(id: string, data: T): Observable<T> {
      return this.http.put<T>(`${environment.apiUrl}${this.apiUrl}/editar/${id}`, data);
    }
  
    eliminar(dni: string): Observable<void> {
      return this.http.delete<void>(`${environment.apiUrl}${this.apiUrl}/eliminar/${dni}`);
    }
}
