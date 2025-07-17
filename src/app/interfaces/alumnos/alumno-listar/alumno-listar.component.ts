import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlumnosService } from '../../../core/services/alumnos.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-alumno-listar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxPaginationModule,FormsModule ],
  templateUrl: './alumno-listar.component.html',
  styleUrl: './alumno-listar.component.css'
})

export class AlumnoListarComponent implements OnInit {
  alumnos: any[] = [];
  alumnosFiltrados: any[] = [];
  itemsPerPage: number = 8;
  page: number = 1;

  constructor(private alumnoService: AlumnosService) {}

  ngOnInit() {
    this.obtenerAlumnos();
  }

  obtenerAlumnos() {
    this.alumnoService.listar().subscribe({
      next: (data) => {
        this.alumnos = data;
        this.alumnosFiltrados = data; // Inicialmente, todos los alumnos están visibles
      },
      error: (err) => console.error('Error al obtener alumnos:', err)
    });
  }
  filtro: string = '';

filtrarAlumnos() {
  if (!this.alumnos || this.alumnos.length === 0) {
    this.alumnosFiltrados = [];
    return;
  }

  const term = this.filtro ? this.filtro.toLowerCase().trim() : '';

  if (term === '') {
    this.alumnosFiltrados = this.alumnos;
    return;
  }

  this.alumnosFiltrados = this.alumnos.filter(alumno =>
    (`${alumno.nombre} ${alumno.apellido}`).toLowerCase().includes(term)
  );

  console.log("🔍 Resultados filtrados:", this.alumnosFiltrados);
}

  onPageChange(event: number) {
    this.page = event;
  }
}
