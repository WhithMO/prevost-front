import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CursoService } from '../../../core/services/curso.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-curso-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './curso-form.component.html',
  styleUrls: ['./curso-form.component.css']
})
export class CursoFormComponent {
  cursoForm: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private router: Router
  ) {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]], // Campo corregido
      descripcion: ['', [Validators.required, Validators.minLength(3)]]
    });
  }
  irACursos() {
    this.router.navigate(['/cursos']);
  }
  agregarCurso(): void {
    if (this.cursoForm.invalid) {
      // Verifica qué campos están incorrectos
      const camposInvalidos = Object.keys(this.cursoForm.controls).filter(
        campo => this.cursoForm.controls[campo].invalid
      );
      this.mensajeError = `Por favor, complete correctamente: ${camposInvalidos.join(', ')}`;

      Swal.fire({
        icon: 'error',
        title: 'Campos Incompletos',
        text: this.mensajeError
      });

      return;
    }

    const cursoData = this.cursoForm.value;

    // Validar si el nombre del curso ya está registrado
    this.cursoService.listar().subscribe({
      next: (cursos) => {
        const nombreExiste = cursos.some(curso => curso.nombre.toLowerCase() === cursoData.nombre.toLowerCase());

        if (nombreExiste) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El nombre del curso ya está registrado.',
            confirmButtonText: 'Aceptar'
          });
          return;
        }

        // Si el nombre no está repetido, agregar el curso
        this.cursoService.agregar(cursoData).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Curso Agregado',
              text: 'El curso ha sido agregado correctamente.'
            }).then(() => {
              this.cursoForm.reset();
              this.router.navigate(['/cursos']);
            });
          },
          error: (err) => {
            console.error('Error al agregar curso:', err);
            this.mensajeError = 'Error al agregar curso';
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
          text: 'Hubo un problema al verificar el nombre del curso. Inténtalo nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
}