import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteAsistenciaService {

  private apiUrl = '/rest/asistencia';

  constructor(private http: HttpClient) { }

  obtenerReportes(
    estado?: string,
    idaula?: number,
    fechaInicio?: string,
    fechaFin?: string,
    idprofesor?: number // nuevo parámetro
  ): Observable<any[]> {
    let params = new HttpParams();
  
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
    if (idprofesor) {
      params = params.set('idprofesor', idprofesor);
    }
  
    return this.http.get<any[]>(`${this.apiUrl}/buscarportes`, { params });
  }
   
}
