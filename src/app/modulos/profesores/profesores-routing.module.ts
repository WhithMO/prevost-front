import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfesorFormComponent } from '../../interfaces/profesores/profesor-form/profesor-form.component';
import { ProfesorListarComponent } from '../../interfaces/profesores/profesor-listar/profesor-listar.component';
import { EditarProfesorComponent } from '../../interfaces/profesores/editar-profesor/editar-profesor.component';

const routes: Routes = [
  { path: 'form', component: ProfesorFormComponent},
  { path: '', component: ProfesorListarComponent},
  { path: 'editarProfesor/:idprofesor', component: EditarProfesorComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfesoresRoutingModule { }
