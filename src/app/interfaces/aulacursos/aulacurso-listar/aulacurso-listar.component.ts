import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AulacursoService } from '../../../core/services/aulacurso.service';

@Component({
  selector: 'app-aulacurso-listar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './aulacurso-listar.component.html',
  styleUrl: './aulacurso-listar.component.css'
})
export class AulacursoListarComponent implements OnInit {
  aulacursos: any[] = [];
  error: string = '';

  constructor(private aulasCursosService: AulacursoService) {}

  ngOnInit(): void {
    this.obtenerAulasCursos();
  }

  obtenerAulasCursos(): void {
    this.aulasCursosService.listar().subscribe({
      next: (data) => {
        console.log('Datos obtenidos de la API:', data); // Depuración
        this.aulacursos = data;
      },
      error: (err) => {
        this.error = `Error al obtener datos: ${err}`;
      }
    });
  }
}