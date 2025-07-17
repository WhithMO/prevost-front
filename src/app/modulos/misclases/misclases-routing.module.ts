import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MisclasesListarComponent } from '../../interfaces/miclases/misclases-listar/misclases-listar.component';
import { MisclasesDetalleComponent } from '../../interfaces/miclases/misclases-detalle/misclases-detalle.component';

const routes: Routes = [
  { path: '', component: MisclasesListarComponent},
  { path: 'detalle/:idClase', component: MisclasesDetalleComponent },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MisclasesRoutingModule { }
