import { Component, OnInit } from '@angular/core';
import { AsginaralumnocursoService } from '../../../core/services/asginaralumnocurso.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-asginar-listar',
  imports: [RouterModule, CommonModule, NgxPaginationModule],
  templateUrl: './asginar-listar.component.html',
  styleUrl: './asginar-listar.component.css'
})
export class AsginarListarComponent implements OnInit {
  listaAsignaciones: any[] = [];
  asignarFiltrados: any[] = [];
  itemsPerPage: number = 10;
  page: number = 1;

  constructor(private asignarAlumnoCursoService: AsginaralumnocursoService) {}

  ngOnInit(): void {
    this.listarAsignaciones();
  }
  onPageChange(event: number) {
    this.page = event;
  }
  listarAsignaciones(): void {
    this.asignarAlumnoCursoService.listar().subscribe({
      next: (data) => {
        this.listaAsignaciones = data.map(asignacion => ({
          ...asignacion,
          alumno: asignacion.alumno ? { ...asignacion.alumno, alumnoClases: undefined } : {},
          clase: asignacion.clase || { curso: {} }
        }));
      },
      error: (error) => {
        console.error('Error al listar asignaciones:', error);
      }
    });
  }
  
  filtro: string = '';
  filtrarAlumnos() {
    if (!this.listaAsignaciones || this.listaAsignaciones.length === 0) {
      this.asignarFiltrados = [];
      return;
    }
  
    // Verificamos si `this.filtro` está definido y lo convertimos en minúsculas
    const term = this.filtro ? this.filtro.toLowerCase().trim() : '';
  
    // Si el término está vacío, mostramos todos los alumnos
    if (term === '') {
      this.asignarFiltrados = this.listaAsignaciones;
      return;
    }

  }
}