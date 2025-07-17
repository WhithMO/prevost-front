import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralservicesService } from './generalservices.service';

export interface Clase {
  idClase?: number;
  nombrecurso: string;
  nombreAula: string;
  fechaClase: string;
  horaInicio: string;
  horaFin: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClasesService extends GeneralservicesService<any> {

  constructor(http: HttpClient) {
    super(http, '/rest/clases');
  }

  obtenerGruposPorClase(idClase: number) {
    return this.http.get<any[]>(`${this.http}/${idClase}/grupos`);
  }
}
