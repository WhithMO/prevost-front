import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AulasService } from '../../../core/services/aulas.service';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-aula-listar',
  imports: [RouterModule, CommonModule, NgxPaginationModule],
  templateUrl: './aula-listar.component.html',
  styleUrl: './aula-listar.component.css'
})
export class AulaListarComponent implements OnInit {
    aulas: any[] = [];
    page: number = 1;
    itemsPerPage: number = 9;
  
      constructor(private aulasService: AulasService) {}
  
      ngOnInit(): void {
        this.obtenerAulas();
      }
    
      obtenerAulas(): void {
        this.aulasService.listar().subscribe({
          next: (data) => {
            this.aulas = data;
          },
          error: (error) => {
            console.error('Error al obtener aulas:', error);
          }
        });
      }

      onPageChange(event: number): void {
        this.page = event;
      }

}


