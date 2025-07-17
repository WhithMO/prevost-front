import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AsignaralumnocursoRoutingModule } from './asignaralumnocurso-routing.module';
import { AsginarEditComponent } from '../../interfaces/asignaralumncurso/asginar-edit/asginar-edit.component';
import { AsginarListarComponent } from '../../interfaces/asignaralumncurso/asginar-listar/asginar-listar.component';
import { AsignarFormComponent } from '../../interfaces/asignaralumncurso/asginar-form/asginar-form.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AsignaralumnocursoRoutingModule,
    AsginarEditComponent,
    AsginarListarComponent,
    AsignarFormComponent
  ]
})
export class AsignaralumnocursoModule { }
