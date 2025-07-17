import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfesoresService } from '../../../core/services/profesores.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../core/services/login.service';

@Component({
  selector: 'app-profesor-listar',
  imports: [RouterModule, CommonModule, NgxPaginationModule,FormsModule],
  templateUrl: './profesor-listar.component.html',
  styleUrl: './profesor-listar.component.css'
})
export class ProfesorListarComponent implements OnInit {

  profesores: any[] = [];
  page: number = 1;
  itemsPerPage: number = 10;

  isAdmin: boolean = false;
  isProfessor: boolean = false;
  hasAccess: boolean = false;
  isLoggedIn: boolean = false;
  rolUsuario: string = '';

    constructor(private profesoresService: ProfesoresService, private loginService: LoginService) {}

    ngOnInit(): void {
      this.obtenerProfesores();
      this.profesoresFiltrados = this.profesoresFiltrados.filter(profesor => profesor.dni !== '99999999');

    }
  
    obtenerProfesores(): void {
      this.profesoresService.listar().subscribe({
        next: (data) => {
          this.profesores = data;
          this.profesoresFiltrados = data; 
        },
        error: (error) => {
          console.error('Error al obtener profesores:', error);
        }
      });
    }

    onPageChange(event: number): void {
      this.page = event;
    }
    
    profesoresFiltrados:any[] = [];
    filtro: string = '';
    filtrarProfesores() {
      if (!this.profesores || this.profesores.length === 0) {
        this.profesoresFiltrados = [];
        return;
      }
    
      // Verificamos si `this.filtro` está definido y lo convertimos en minúsculas
      const term = this.filtro ? this.filtro.toLowerCase().trim() : '';
    
      // Si el término está vacío, mostramos todos los alumnos
      if (term === '') {
        this.profesoresFiltrados = this.profesores;
        return;
      }
    
      // Filtramos por nombre y apellido
      this.profesoresFiltrados = this.profesores.filter(alumno =>
        (`${alumno.nombre} ${alumno.apellido}`).toLowerCase().includes(term)
      );
    
      console.log("🔍 Resultados filtrados:", this.profesoresFiltrados);
    }
    
    actualizarEstado(): void {
      this.isAdmin = this.loginService.isAdmin();
      this.isProfessor = this.loginService.isProfessor();
      this.hasAccess = this.loginService.hasAccess();
    }
  }
  