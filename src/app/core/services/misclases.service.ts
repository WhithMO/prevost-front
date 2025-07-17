import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MisclasesService {

  private apiUrl = '/rest/profesores';

  constructor(private http: HttpClient) {}

  obternerCursosProfesor(idProfesor: String): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/clases/${idProfesor}`);
  }

  obtenerClaseConAlumnos(idClase: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idClase}/alumnos`);
  }

  obtenerAsistenciaClase(idClase: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/asistencias/${idClase}`);
  }

  registrarAsistencias(asistencias: any[]): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/asistencias`, asistencias);
  }

  editarAsistencias(asistenciaseditar: any[]): Observable<any> {
    console.log('📌 JSON enviado al backend:', asistenciaseditar); // Verificar que los datos tengan idasistencia
    return this.http.put<any>(`${this.apiUrl}/asistenciaseditar`, asistenciaseditar);
  }
  
  
}
