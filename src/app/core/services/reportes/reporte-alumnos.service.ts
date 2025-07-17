import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteAlumnosService {

  private apiUrl = '/rest/alumnos';

  constructor(private http: HttpClient) { }

  obtenerReportes(estado?: string, idaula?: number, fechaInicio?: string, fechaFin?: string): Observable<any[]> {
    let params = new HttpParams();

    // Agregar parámetros opcionales solo si tienen valor
    if (estado) {
      params = params.set('estado', estado);
    }
    if (idaula) {
      params = params.set('idaula', idaula.toString());
    }
    if (fechaInicio) {
      params = params.set('fechaInicio', fechaInicio);
    }
    if (fechaFin) {
      params = params.set('fechaFin', fechaFin);
    }

    return this.http.get<any[]>(`${this.apiUrl}/buscarportes`, { params });
  }

  obtenerAsistencias(idAlumno: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idAlumno}/reporteasistencias`);
  }

}