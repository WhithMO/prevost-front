import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralservicesService } from './generalservices.service';

export interface Alumno {
  idalumno?: number;
  nombrealumno: string;
  apellidoalumno: string;
  fecharegistro: number;
  nombreapoderado: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root'
})
export class AlumnosService extends GeneralservicesService<any> {

  constructor(http: HttpClient) {
    super(http, '/rest/alumnos');
  }

  obtenerAlumnosPorAula() {
    return this.http.get<any[]>(`${this.apiUrl}/listarsinaula`);
  }
  
}
