import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuarioListarComponent } from '../../interfaces/usuarios/usuario-listar/usuario-listar.component';
import { UsuarioFormComponent } from '../../interfaces/usuarios/usuario-form/usuario-form.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    UsuariosRoutingModule,
    UsuarioListarComponent,  // Importar UsuarioListarComponent aquí (sin declararlo)
    UsuarioFormComponent,     // Importar UsuarioFormComponent aquí (sin declararlo)
    RouterModule,  // Asegúrate de importar RouterModule aquí
  ]
})
export class UsuariosModule { }
