import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrls = `${environment.apiUrl}/rest/asistencia/listaranioscantidades`;
  private apiUrls2 = `${environment.apiUrl}/rest/asistencia/listarporcentajes`;

  constructor(private http: HttpClient) {}

  ObtenerAnoCantidad(estado: String, inicio: number, fin: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrls}/${estado}/${inicio}/${fin}`);
  }

  ObtenerProcentajes(inicioPastel: String, finPastel: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrls2}/${inicioPastel}/${finPastel}`);
  }

}
