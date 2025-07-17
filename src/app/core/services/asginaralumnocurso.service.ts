import { Injectable } from '@angular/core';
import { GeneralservicesService } from './generalservices.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AsginaralumnocursoService extends GeneralservicesService<any> {
  
  constructor(http: HttpClient) {
    super(http, '/rest/alumnoclase');
  }

  // ✅ Método especial para asignar un grupo de alumnos a una clase
  asignarGrupoAlumnos(idClase: number, idsAlumnos: number[]): Observable<any> {
    const requestData = {
      idClase: idClase,
      idsAlumnos: idsAlumnos
    };
    return this.http.post(`${this.apiUrl}/agregargrupo`, requestData);
  }
}