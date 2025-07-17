import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AulasService } from '../../../core/services/aulas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AlumnosService } from '../../../core/services/alumnos.service';

@Component({
  selector: 'app-aula-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './aula-form.component.html',
  styleUrl: './aula-form.component.css'
})

export class AulaFormComponent {
  aulasForm!: FormGroup;
  alumnosDisponibles: any[] = [];
  alumnosSeleccionados: any[] = [];
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private aulaService: AulasService,
    private alumnoService: AlumnosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.aulasForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      capacidad: [1, [Validators.required, Validators.min(1)]]
    });

    this.obtenerAlumnos();
  }

  obtenerAlumnos() {
    this.alumnoService.obtenerAlumnosPorAula().subscribe({
      next: (data) => {
        this.alumnosDisponibles = data;
      },
      error: (err) => {
        console.error('Error al obtener alumnos:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los alumnos.'
        });
      }
    });
  }

  agregarAlumno(event: any) {
    const idAlumno = Number(event.target.value);
    const alumno = this.alumnosDisponibles.find(a => a.idalumno === idAlumno);
  
    if (!alumno) return;
  
    if (this.alumnosSeleccionados.some(a => a.idalumno === idAlumno)) {
      Swal.fire({
        icon: 'warning',
        title: 'Alumno Duplicado',
        text: 'Este alumno ya ha sido agregado.',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    if (this.alumnosSeleccionados.length >= this.aulasForm.value.capacidad) {
      Swal.fire({
        icon: 'warning',
        title: 'Capacidad Excedida',
        text: 'No puedes agregar más alumnos de la capacidad del aula.'
      });
      return;
    }
  
    this.alumnosSeleccionados.push(alumno);
  }
  
  

  eliminarAlumno(id: number) {
    this.alumnosSeleccionados = this.alumnosSeleccionados.filter(a => a.idalumno !== id);
  }

  irAAulas() {
    this.router.navigate(['/aulas']);
  }

  agregarAula(): void {
    if (this.aulasForm.invalid) {
      const camposInvalidos = Object.keys(this.aulasForm.controls).filter(
        campo => this.aulasForm.controls[campo].invalid
      );
      this.mensajeError = `Por favor, complete correctamente: ${camposInvalidos.join(', ')}`;

      Swal.fire({
        icon: 'error',
        title: 'Campos Incompletos',
        text: this.mensajeError
      });

      return;
    }

    const aulaData = {
      nombre: this.aulasForm.value.nombre,
      capacidad: this.aulasForm.value.capacidad,
      alumnosIds: this.alumnosSeleccionados.map(a => a.idalumno)
    };

    this.aulaService.listar().subscribe({
      next: (aulas) => {
        const nombreExiste = aulas.some(aula => aula.nombre.toLowerCase() === aulaData.nombre.toLowerCase());

        if (nombreExiste) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El nombre del aula ya está registrado.',
            confirmButtonText: 'Aceptar'
          });
          return;
        }

        this.aulaService.crearAula(aulaData).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Aula Agregada',
              text: 'El aula ha sido agregada correctamente.'
            }).then(() => {
              this.aulasForm.reset();
              this.alumnosSeleccionados = [];
              this.router.navigate(['/aulas']);
            });
          },
          error: (err) => {
            console.error('Error al agregar aula:', err);
            this.mensajeError = 'Error al agregar aula';
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: this.mensajeError
            });
          }
        });
      },
      error: (err) => {
        console.error('Error al verificar duplicados:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al verificar el nombre del aula. Inténtalo nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
}