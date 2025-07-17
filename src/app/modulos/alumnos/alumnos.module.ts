import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 👉 IMPORTA ESTO
import { AlumnosRoutingModule } from './alumnos-routing.module';
import { AlumnoListarComponent } from '../../interfaces/alumnos/alumno-listar/alumno-listar.component';
import { AlumnoFormComponent } from '../../interfaces/alumnos/alumno-form/alumno-form.component';
import { AlumnoEditComponent } from '../../interfaces/alumnos/alumno-edit/alumno-edit.component';

@NgModule({
  declarations: [ // 👉 AQUÍ VAN LOS COMPONENTES

  ],
  imports: [
    CommonModule,
    FormsModule, // 👉 AGREGA ESTO PARA USAR ngModel
    AlumnosRoutingModule,    AlumnoListarComponent,
    AlumnoFormComponent,
    AlumnoEditComponent
  ]
})
export class AlumnosModule { }
