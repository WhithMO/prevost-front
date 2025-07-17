import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AulacursoService } from '../../../core/services/aulacurso.service';
import { AlumnosService } from '../../../core/services/alumnos.service';
import { CursoService } from '../../../core/services/curso.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-aulacurso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './aulacurso-form.component.html',
  styleUrl: './aulacurso-form.component.css'
})
export class AulacursoFormComponent implements OnInit {
  aulacursoForm: FormGroup;
  listaAlumnos: any[] = [];
  listaCursos: any[] = [];

  constructor(
    private fb: FormBuilder,
    private aulasCursosService: AulacursoService,
    private alumnosService: AlumnosService,
    private cursosService: CursoService,
    private router: Router
  ) {
    this.aulacursoForm = this.fb.group({
      idalumnos: [[], Validators.required], // Lista de alumnos seleccionados
      idcurso: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.cargarAlumnos();
    this.cargarCursos();
  }

  cargarAlumnos(): void {
    this.alumnosService.listar().subscribe({
      next: (data) => {
        this.listaAlumnos = data;
      },
      error: (err) => {
        console.error('Error al obtener alumnos:', err);
      }
    });
  }

  cargarCursos(): void {
    this.cursosService.listar().subscribe({
      next: (data) => {
        this.listaCursos = data;
      },
      error: (err) => {
        console.error('Error al obtener cursos:', err);
      }
    });
  }

  agregarAulaCurso(): void {
    if (this.aulacursoForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, complete todos los campos correctamente.',
      });
      return;
    }

    const fechaRegistro = new Date().toISOString().split('T')[0];

    const registros = this.aulacursoForm.value.idalumnos.map((idalumno: number) => ({
      alumno: { idalumno },
      curso: { idcurso: this.aulacursoForm.value.idcurso },
      fechaRegistro: fechaRegistro
    }));

    console.log('Datos enviados:', registros); // Depuración

    this.aulasCursosService.agregarLista(registros).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Alumnos agregados al curso correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/aulacurso'])
        });
      },
      error: (error) => {
        console.error('Error al agregar alumnos al curso:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron agregar los alumnos al curso. Intente nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
}