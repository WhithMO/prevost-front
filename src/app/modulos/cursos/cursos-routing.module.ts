import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CursoFormComponent } from '../../interfaces/cursos/curso-form/curso-form.component';
import { CursoListarComponent } from '../../interfaces/cursos/curso-listar/curso-listar.component';
import { EditarCursoComponent } from '../../interfaces/cursos/editar-curso/editar-curso.component';

const routes: Routes = [
  { path: 'form', component: CursoFormComponent},
  { path: '', component: CursoListarComponent},
  { path: 'EditarCurso/:idcurso', component: EditarCursoComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CursosRoutingModule { }
