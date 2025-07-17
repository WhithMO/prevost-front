import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AsignarFormComponent } from '../../interfaces/asignaralumncurso/asginar-form/asginar-form.component';
import { AsginarEditComponent } from '../../interfaces/asignaralumncurso/asginar-edit/asginar-edit.component';
import { AsginarListarComponent } from '../../interfaces/asignaralumncurso/asginar-listar/asginar-listar.component';

const routes: Routes = [
    { path: 'form', component: AsignarFormComponent},
    { path: 'editar/:idClase', component: AsginarEditComponent},
    { path: '', component: AsginarListarComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AsignaralumnocursoRoutingModule { }
