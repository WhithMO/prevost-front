import { Injectable } from '@angular/core';
import { GeneralservicesService } from './generalservices.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AulacursoService extends GeneralservicesService<any> {

  constructor(http: HttpClient) {
    super(http, '/rest/aulacurso');
  }
}
