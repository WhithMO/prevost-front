import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClaseFormComponent } from '../../interfaces/clases/clase-form/clase-form.component';
import { ClaseListarComponent } from '../../interfaces/clases/clase-listar/clase-listar.component';
import { ClaseEditComponent } from '../../interfaces/clases/clase-edit/clase-edit.component';

const routes: Routes = [
  { path: 'form', component: ClaseFormComponent},
  { path: 'editar/:id', component: ClaseEditComponent},
  { path: '', component: ClaseListarComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClasesRoutingModule { }
