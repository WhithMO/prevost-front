import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Usuario, UsuariosService } from '../../../core/services/usuarios.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-usuario-listar',
  standalone: true,
  imports: [CommonModule, RouterModule, NgxPaginationModule],
  templateUrl: './usuario-listar.component.html',
  styleUrls: ['./usuario-listar.component.css']
})
export class UsuarioListarComponent implements OnInit {
  usuarios:any[] = [];
  usuarioSeleccionado: Usuario | null = null;
  error: string = '';

  page: number = 1;
  itemsPerPage: number = 8;

  constructor(private usuarioService: UsuariosService) { }

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (data) => {
        console.log('Datos obtenidos de la API:', data);
        this.usuarios = data;
      },
      error: (err) => {
        this.error = `Error al obtener usuarios: ${err}`;
      }
    });
  }

  seleccionarUsuario(usuario: Usuario): void {
    this.usuarioSeleccionado = { ...usuario };
  }

  onPageChange(event: number): void {
    this.page = event;
  }
}
