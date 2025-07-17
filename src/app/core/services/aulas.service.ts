import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralservicesService } from './generalservices.service';

export interface Aula {
  idaula?: number;
  nombreAula: string;
  capacidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class AulasService extends GeneralservicesService<any> {

  constructor(http: HttpClient) {
    super(http, '/rest/aulas');
  }

  crearAula(aula: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/agregaraulaalumno`, aula);
  }

  obtenerAlumnosPorAula(idClase: number) {
    return this.http.get<any[]>(`${this.apiUrl}/listaralumnos/${idClase}`);
  }

  actualizarAula(idaula: number, aula: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/editaraulaalumno/${idaula}`, aula);
  }  

}