import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuarioFormComponent } from '../../interfaces/usuarios/usuario-form/usuario-form.component';
import { UsuarioListarComponent } from '../../interfaces/usuarios/usuario-listar/usuario-listar.component';
import { UsuarioEditarComponent } from '../../interfaces/usuarios/usuario-editar/usuario-editar.component';

const routes: Routes = [
  { path: 'form', component: UsuarioFormComponent},
  { path: '', component: UsuarioListarComponent},
  { path: 'editar/:idusuario', component: UsuarioEditarComponent },  // Esta es la ruta para editar
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
