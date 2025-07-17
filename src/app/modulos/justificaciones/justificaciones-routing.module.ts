import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JustificacionFormComponent } from '../../interfaces/justificaciones/justificacion-form/justificacion-form.component';
import { JustificacionListarComponent } from '../../interfaces/justificaciones/justificacion-listar/justificacion-listar.component';
import { JustificacionRevisarComponent } from '../../interfaces/justificaciones/justificacion-revisar/justificacion-revisar.component';

const routes: Routes = [
  { path: 'form', component: JustificacionFormComponent},
  { path: 'revisar/:idjustificacion', component: JustificacionRevisarComponent},
  { path: '', component: JustificacionListarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JustificacionesRoutingModule { }
