import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AulacursoRoutingModule } from './aulacurso-routing.module';
import { AulacursoEditComponent } from '../../interfaces/aulacursos/aulacurso-edit/aulacurso-edit.component';
import { AulacursoFormComponent } from '../../interfaces/aulacursos/aulacurso-form/aulacurso-form.component';
import { AulacursoListarComponent } from '../../interfaces/aulacursos/aulacurso-listar/aulacurso-listar.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AulacursoRoutingModule,
    AulacursoEditComponent,
    AulacursoFormComponent,
    AulacursoListarComponent
  ]
})
export class AulacursoModule { }
