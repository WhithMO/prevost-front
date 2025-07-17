import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../core/services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit{

  username: string = '';
  rolUsuario: string = '';
  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.loginService.obtenerUsuario() || 'Desconocido';
    this.rolUsuario = this.loginService.obtenerRol() || 'Invitado';
  }
  cerrarSeccion(): void {
    this.loginService.cerrarSesion();
    this.router.navigate(['/login']);
  }

}
