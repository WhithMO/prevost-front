import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfesoresRoutingModule } from './profesores-routing.module';
import { ProfesorListarComponent } from '../../interfaces/profesores/profesor-listar/profesor-listar.component';
import { ProfesorFormComponent } from '../../interfaces/profesores/profesor-form/profesor-form.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProfesoresRoutingModule,
    ProfesorListarComponent,
  
    ProfesorFormComponent
  ]
})
export class ProfesoresModule { }
