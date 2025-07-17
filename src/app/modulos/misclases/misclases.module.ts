import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MisclasesRoutingModule } from './misclases-routing.module';
import { MisclasesListarComponent } from '../../interfaces/miclases/misclases-listar/misclases-listar.component';
import { MisclasesDetalleComponent } from '../../interfaces/miclases/misclases-detalle/misclases-detalle.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MisclasesRoutingModule,
    MisclasesListarComponent,
    MisclasesDetalleComponent
  ]
})
export class MisclasesModule { }
