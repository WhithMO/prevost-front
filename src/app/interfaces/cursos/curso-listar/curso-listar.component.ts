import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { CursoService } from '../../../core/services/curso.service';

@Component({
  selector: 'app-curso-listar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxPaginationModule],
  templateUrl: './curso-listar.component.html',
  styleUrl: './curso-listar.component.css'
})
export class CursoListarComponent {
  cursos: any[] = [];
  page: number = 1;
  itemsPerPage: number = 3;
  
    constructor(private cursoService: CursoService) {}
  
    ngOnInit(): void {
      this.obtenerCursos();
    }
  
    obtenerCursos(): void {
      this.cursoService.listar().subscribe({
        next: (data) => {
          this.cursos = data;
        },
        error: (error) => {
          console.error('Error al obtener cursos:', error);
        }
      });
    }
    
    onPageChange(event: number): void {
      this.page = event;
    }

    trackById(index: number, item: any): any {
      return item.idaula;
    }
    
}