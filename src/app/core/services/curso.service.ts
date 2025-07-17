import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { GeneralservicesService } from './generalservices.service';

export interface Curso {
  idcurso?: number;
  nombrecurso: string;
  descripcion: string;
  fechaInicio: number;
  fechaFin: number;
}

@Injectable({
  providedIn: 'root',
})
export class CursoService extends GeneralservicesService<any> {

  constructor(http: HttpClient) {
    super(http, '/rest/cursos');
  }
}
