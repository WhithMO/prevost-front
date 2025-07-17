import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AulaFormComponent } from '../../interfaces/aulas/aula-form/aula-form.component';
import { AulaListarComponent } from '../../interfaces/aulas/aula-listar/aula-listar.component';
import { AulaEditComponent } from '../../interfaces/aulas/aula-edit/aula-edit.component';
import { AulasDetalleComponent } from '../../interfaces/aulas/aulas-detalle/aulas-detalle.component';

const routes: Routes = [
  { path: 'form', component: AulaFormComponent},
  { path: 'editar/:idaula', component: AulaEditComponent},
  { path: 'detalle/:idaula', component: AulasDetalleComponent},
  { path: '', component: AulaListarComponent},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AulasRoutingModule { }