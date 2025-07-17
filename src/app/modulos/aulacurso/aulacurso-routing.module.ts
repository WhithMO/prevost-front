import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AulacursoFormComponent } from '../../interfaces/aulacursos/aulacurso-form/aulacurso-form.component';
import { AulacursoEditComponent } from '../../interfaces/aulacursos/aulacurso-edit/aulacurso-edit.component';
import { AulacursoListarComponent } from '../../interfaces/aulacursos/aulacurso-listar/aulacurso-listar.component';

const routes: Routes = [
    { path: 'form', component: AulacursoFormComponent},
    { path: 'editar/:idaulacurso', component: AulacursoEditComponent},
    { path: '', component: AulacursoListarComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AulacursoRoutingModule { }
