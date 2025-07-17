import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JustificacionesRoutingModule } from './justificaciones-routing.module';
import { JustificacionFormComponent } from '../../interfaces/justificaciones/justificacion-form/justificacion-form.component';
import { JustificacionListarComponent } from '../../interfaces/justificaciones/justificacion-listar/justificacion-listar.component';
import { JustificacionRevisarComponent } from '../../interfaces/justificaciones/justificacion-revisar/justificacion-revisar.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JustificacionesRoutingModule,
    JustificacionFormComponent,
    JustificacionListarComponent,
    JustificacionRevisarComponent
  ]
})
export class JustificacionesModule { }
