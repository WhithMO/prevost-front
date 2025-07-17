import { Injectable } from '@angular/core';
import { GeneralservicesService } from './generalservices.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JustificacionesService extends GeneralservicesService<any> {
  
  constructor(http: HttpClient) {
    super(http, '/rest/justificaciones');
  }

  actualizarEstado(id: number, estadoData: any) {
    return this.http.put(`${this.apiUrl}/${id}/estado`, estadoData);
  }
  
  obtenerPorProfesor(idprofesor: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscarprofesor/${idprofesor}`);
  }

  obtenerJustificaciones(idProfesor: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/profesor/${idProfesor}`);
  }

  agregarJustificacion(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregarjusti`, formData);
  }
  
  descargarArchivo(nombreArchivo: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/archivo/${nombreArchivo}`, {
      responseType: 'blob'
    });
  }
}