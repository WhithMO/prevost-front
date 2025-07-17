import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';  // Importa ReactiveFormsModule

import { CursosRoutingModule } from './cursos-routing.module';
import { CursoListarComponent } from '../../interfaces/cursos/curso-listar/curso-listar.component';
import { CursoFormComponent } from '../../interfaces/cursos/curso-form/curso-form.component';
import { EditarCursoComponent } from '../../interfaces/cursos/editar-curso/editar-curso.component';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    CursosRoutingModule,
    ReactiveFormsModule,
    CursoListarComponent,
    CursoFormComponent,
    EditarCursoComponent
  ]
})
export class CursosModule { }
