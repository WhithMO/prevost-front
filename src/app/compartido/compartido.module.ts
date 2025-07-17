import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { ContenidoComponent } from './contenido/contenido.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
// ✅ Importa los módulos de Angular Material correctamente
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';  // ✅ Si usas MatMenu
@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    RouterModule,
    ContenidoComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    MatSidenavModule, 
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatMenuModule

  ],
  exports: [
    ContenidoComponent
  ]
})
export class CompartidoModule { }
