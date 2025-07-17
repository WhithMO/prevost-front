import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralservicesService } from './generalservices.service';

export interface Usuario {
  idusuario?: number;
  nombre_usuario: string;
  nombre: string;
  apellido: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService extends GeneralservicesService<any> {

  constructor(http: HttpClient) {
    super(http, '/rest/usuarios');
  }
}
