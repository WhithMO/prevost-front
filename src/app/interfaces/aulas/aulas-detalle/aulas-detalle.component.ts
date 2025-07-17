import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AulasService } from '../../../core/services/aulas.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-aulas-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './aulas-detalle.component.html',
  styleUrl: './aulas-detalle.component.css'
})
export class AulasDetalleComponent implements OnInit {

  idaula!: number;
  alumnos: any[] = [];
  aulaNombre: string = '';
  aulaNombres: string = '';

  constructor(
    private route: ActivatedRoute,
    private aulaService: AulasService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idaula = Number(this.route.snapshot.paramMap.get('idaula'));


    if (this.idaula) {
      this.obtenerAlumnos();
      this.buscarAula();
    }
  }

  obtenerAlumnos() {
    this.aulaService.obtenerAlumnosPorAula(this.idaula).subscribe({
      next: (data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          this.alumnos = data;
          this.aulaNombre = data[0].aula?.nombre || 'Sin nombre';
        } else {
          this.alumnos = [];
          this.aulaNombre = 'Sin alumnos';
        }
      },
      error: (err) => {
        console.error('Error al obtener alumnos:', err);
        this.alumnos = [];
        this.aulaNombre = 'Error al cargar';
      }
    });
  }
  

  buscarAula() {
    this.aulaService.buscaridNumber(this.idaula).subscribe({
      next: (data) => {
        console.log('Datos del aula:', data);
        this.aulaNombre = data.nombre;
      },
      error: (err) => {
        console.error('Error al buscar aula:', err);
      }
    });
  }
  

  irAAulas() {
    this.router.navigate(['/aulas']);
  }
}
