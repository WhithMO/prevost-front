import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AlumnoListarComponent } from '../../interfaces/alumnos/alumno-listar/alumno-listar.component';
import { AlumnoFormComponent } from '../../interfaces/alumnos/alumno-form/alumno-form.component';
import { AlumnoEditComponent } from '../../interfaces/alumnos/alumno-edit/alumno-edit.component';

const routes: Routes = [
  { path: 'form', component: AlumnoFormComponent},
  { path: 'editar/:idalumno', component: AlumnoEditComponent},
  { path: '', component: AlumnoListarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlumnosRoutingModule { }