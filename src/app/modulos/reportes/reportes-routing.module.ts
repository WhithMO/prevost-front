import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReporteAsistenciaComponent } from '../../reportes/reporte-asistencia/reporte-asistencia.component';
import { ReporteAlumnosComponent } from '../../reportes/reporte-alumnos/reporte-alumnos.component';
import { ReportelistaComponent } from '../../reportes/reporte-profesor/reportelista/reportelista.component';
import { ReportedetalleComponent } from '../../reportes/reporte-profesor/reportedetalle/reportedetalle.component';

const routes: Routes = [
  { path: 'asistencia', component: ReporteAsistenciaComponent},
  { path: 'alumnos', component: ReporteAlumnosComponent},
  { path: 'profesor', component: ReportelistaComponent},
  { path: 'profesordetalle/:idClase', component: ReportedetalleComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportesRoutingModule { }
