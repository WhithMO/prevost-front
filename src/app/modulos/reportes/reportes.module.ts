import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportesRoutingModule } from './reportes-routing.module';
import { ReporteAsistenciaComponent } from '../../reportes/reporte-asistencia/reporte-asistencia.component';
import { ReporteAlumnosComponent } from '../../reportes/reporte-alumnos/reporte-alumnos.component';
import { ReportelistaComponent } from '../../reportes/reporte-profesor/reportelista/reportelista.component';
import { ReportedetalleComponent } from '../../reportes/reporte-profesor/reportedetalle/reportedetalle.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ReportesRoutingModule,
    ReporteAsistenciaComponent,
    ReporteAlumnosComponent,
    ReportelistaComponent,
    ReportedetalleComponent
  ]
})
export class ReportesModule { }
