import { Component, OnInit } from '@angular/core';
import { MisclasesService } from '../../../core/services/misclases.service';
import { LoginService } from '../../../core/services/login.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-reportelista',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './reportelista.component.html',
  styleUrl: './reportelista.component.css'
})
export class ReportelistaComponent  implements OnInit{
  clases: any[] = [];
  clasesFiltradas: any[] = [];
  idProfesor: string = '';
  page: number = 1;
  itemsPerPage: number = 8;

    constructor(private misclasesService: MisclasesService, private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerUsuarioAutenticado();
  }

  obtenerUsuarioAutenticado(): void {
    this.idProfesor = localStorage.getItem('codprofesor') || '';

    if (this.idProfesor) {
      this.obtenerCursos();
    }
  }

  getFormattedDate(fecha: string): string {
    return new Date(fecha).toISOString().split('T')[0];
  }

  obtenerCursos(): void {
    this.misclasesService.obternerCursosProfesor(this.idProfesor).subscribe({
      next: (data) => {
        this.clases = data;
      },
      error: (error) => {
        console.error('Error al obtener clases:', error);
      }
    });
  }
  IrADetalle(idClase: string): void {
    this.router.navigate(['/reportes/profesordetalle', idClase]);
  }
  
  onPageChange(event: number): void {
    this.page = event;
  }
  
}
