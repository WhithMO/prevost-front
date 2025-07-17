import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../core/services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  @Output() sidebarToggled = new EventEmitter<boolean>();
  isSidebarToggled: boolean = false;
  isAdmin: boolean = false; 
  isProfessor: boolean = false;
  hasAccess: boolean = false;
  isLoggedIn: boolean = false;
  rolUsuario: string = '';


  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.rolUsuario = this.loginService.obtenerRol() || 'Invitado';
    this.actualizarEstado();
    this.checkScreenSize(); // Chequeo inicial de pantalla
  }

  actualizarEstado(): void {
    this.isAdmin = this.loginService.isAdmin();
    this.isProfessor = this.loginService.isProfessor();
    this.hasAccess = this.loginService.hasAccess();
  }

  toggleSidebar(): void {
    this.isSidebarToggled = !this.isSidebarToggled;
    this.sidebarToggled.emit(this.isSidebarToggled);
  }

  @HostListener('window:resize', [])
  checkScreenSize(): void {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (window.innerWidth <= 768) {
        sidebar.classList.add('toggled');
        this.isSidebarToggled = true;
      } else {
        sidebar.classList.remove('toggled');
        this.isSidebarToggled = false;
      }
    }
  }
}
