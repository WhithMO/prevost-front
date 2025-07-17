import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AulasRoutingModule } from './aulas-routing.module';
import { AulaFormComponent } from '../../interfaces/aulas/aula-form/aula-form.component';
import { AulaListarComponent } from '../../interfaces/aulas/aula-listar/aula-listar.component';
import { AulaEditComponent } from '../../interfaces/aulas/aula-edit/aula-edit.component';
import { AulasDetalleComponent } from '../../interfaces/aulas/aulas-detalle/aulas-detalle.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AulasRoutingModule,
    AulaListarComponent,
    AulaFormComponent,
    AulaEditComponent,
    AulasDetalleComponent
  ]
})
export class AulasModule { }
