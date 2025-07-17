import { Routes } from '@angular/router';
import { ContenidoComponent } from './compartido/contenido/contenido.component';
import { AuthGuard } from './core/guards/auth.guard';
import { ErrorComponent } from './interfaces/error/error.component';
import { DasboardComponent } from './interfaces/dasboard/dasboard.component';
import { rolesGuard } from './core/guards/roles.guard';

export const routes: Routes = [
  { path: 'login', loadChildren: () => import('./modulos/login/login.module').then(m => m.LoginModule) },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'error', component: ErrorComponent },
  {
    path: '',
    component: ContenidoComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'usuarios',
        loadChildren: () => import('./modulos/usuarios/usuarios.module').then(m => m.UsuariosModule),
        canActivate: [rolesGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'alumnos',
        loadChildren: () => import('./modulos/alumnos/alumnos.module').then(m => m.AlumnosModule),
        canActivate: [rolesGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'profesores',
        loadChildren: () => import('./modulos/profesores/profesores.module').then(m => m.ProfesoresModule),
        canActivate: [rolesGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'aulas',
        loadChildren: () => import('./modulos/aulas/aulas.module').then(m => m.AulasModule),
        canActivate: [rolesGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'cursos',
        loadChildren: () => import('./modulos/cursos/cursos.module').then(m => m.CursosModule),
        canActivate: [rolesGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'clases',
        loadChildren: () => import('./modulos/clases/clases.module').then(m => m.ClasesModule),
        canActivate: [rolesGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'justificaciones',
        loadChildren: () => import('./modulos/justificaciones/justificaciones.module').then(m => m.JustificacionesModule),
        canActivate: [rolesGuard],
        data: { roles: ['PROFESOR', 'ADMINISTRADOR'] }
      },
      {
        path: 'asignarclases',
        loadChildren: () => import('./modulos/asignaralumnocurso/asignaralumnocurso.module').then(m => m.AsignaralumnocursoModule),
        canActivate: [rolesGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'reportes',
        loadChildren: () => import('./modulos/reportes/reportes.module').then(m => m.ReportesModule),
        canActivate: [rolesGuard],
        data: { roles: ['ADMINISTRADOR', 'PROFESOR'] }
      },
      {
        path: 'inicio',
        loadChildren: () => import('./modulos/inicio/inicio.module').then(m => m.InicioModule)
      },
      {
        path: 'dashboard',
        component: DasboardComponent,
        canActivate: [rolesGuard],
        data: { roles: ['ADMINISTRADOR'] }
      },
      {
        path: 'misclases',
        loadChildren: () => import('./modulos/misclases/misclases.module').then(m => m.MisclasesModule),
        canActivate: [rolesGuard],
        data: { roles: ['PROFESOR'] }
      }      
            
    ]
  },
  {
    path: '**',
    redirectTo: 'error'
  }
];
