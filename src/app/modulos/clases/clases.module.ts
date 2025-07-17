import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClasesRoutingModule } from './clases-routing.module';
import { ClaseListarComponent } from '../../interfaces/clases/clase-listar/clase-listar.component';
import { ClaseFormComponent } from '../../interfaces/clases/clase-form/clase-form.component';
import { ClaseEditComponent } from '../../interfaces/clases/clase-edit/clase-edit.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClasesRoutingModule,
    ClaseListarComponent,
    ClaseFormComponent,
    ClaseEditComponent
  ]
})
export class ClasesModule { }
