import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../core/services/login.service';
import { CommonModule } from '@angular/common';
import { JustificacionesService } from '../../../core/services/justificaciones.service';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-justificacion-listar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxPaginationModule, FormsModule ],
  templateUrl: './justificacion-listar.component.html',
  styleUrls: ['./justificacion-listar.component.css']
})

export class JustificacionListarComponent implements OnInit {
  
  justificaciones: any[] = [];
  isAdmin: boolean = false;
  isProfessor: boolean = false;
  idProfesor: string = '';
  page: number = 1;
  itemsPerPage: number = 8;

  constructor(
    private justificacionesService: JustificacionesService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioAutenticado();
  }

  obtenerUsuarioAutenticado(): void {
    this.isAdmin = this.loginService.isAdmin();
    this.isProfessor = this.loginService.isProfessor();

    this.idProfesor = localStorage.getItem('codprofesor') || '';

    console.log('ID del Profesor:', this.idProfesor); // Debugging

    // 🔹 Si se encontró un ID válido, cargamos las justificaciones
    if (this.isAdmin) {
      this.cargarTodasLasJustificaciones();
    } else if (this.isProfessor && this.idProfesor) {
      this.cargarJustificacionesProfesor();
    } else {
      console.warn('No se encontró un ID de profesor válido.');
    }
  }

  cargarTodasLasJustificaciones(): void {
    this.justificacionesService.listar().subscribe({
      next: (data) => this.justificaciones = data,
      error: (error) => console.error('Error al obtener justificaciones:', error)
    });
  }

  cargarJustificacionesProfesor(): void {
    if (!this.idProfesor) {
      console.error('❌ ID de profesor no encontrado en LocalStorage.');
      return;
    }

    this.justificacionesService.obtenerPorProfesor(this.idProfesor).subscribe({
      next: (data) => {
        this.justificaciones = data;
        console.log('Justificaciones cargadas:', this.justificaciones);
      },
      error: (error) => console.error('Error al obtener justificaciones del profesor:', error)
    });
  }

  revisarJustificacion(idjustificacion: number): void {
    this.router.navigate(['/justificaciones/revisar', idjustificacion]);
  }

  onPageChange(event: number): void {
    this.page = event;
  }
}