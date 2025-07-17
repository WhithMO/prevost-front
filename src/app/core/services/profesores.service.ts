import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralservicesService } from './generalservices.service';

export interface Profesor {
  idprofesor?: number;
  nombre: string;
  apellido: string;
  dni: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfesoresService extends GeneralservicesService<any> {

  constructor(http: HttpClient) {
    super(http, '/rest/profesores');
  }
}
