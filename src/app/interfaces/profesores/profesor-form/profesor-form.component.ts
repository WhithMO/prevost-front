import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfesoresService } from '../../../core/services/profesores.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2'; // Importa SweetAlert2

@Component({
  selector: 'app-profesor-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profesor-form.component.html',
  styleUrls: ['./profesor-form.component.css']
})

export class ProfesorFormComponent {
  profesorForm: FormGroup;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private profesoresService: ProfesoresService,
    private router: Router
  ) {
    this.profesorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]], // 8 dígitos
      especialidad: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]] // 9 dígitos
    });
  }
  irAProfesores() {
    this.router.navigate(['/profesores']);
  }
  agregarProfesor(): void {
    if (this.profesorForm.invalid) {
      // Verifica qué campos están incorrectos
      const camposInvalidos = Object.keys(this.profesorForm.controls).filter(
        campo => this.profesorForm.controls[campo].invalid
      );
      this.mensajeError = `Por favor, complete correctamente: ${camposInvalidos.join(', ')}`;

      // Mostrar SweetAlert si el formulario es inválido
      Swal.fire({
        icon: 'error',
        title: 'Campos Incompletos',
        text: this.mensajeError
      });

      return;
    }

    const profesorData = this.profesorForm.value;
    
    // Validar si el DNI o el teléfono ya están registrados
    this.profesoresService.listar().subscribe({
      next: (profesores) => {
        const dniExiste = profesores.some(prof => prof.dni === profesorData.dni);
        const telefonoExiste = profesores.some(prof => prof.telefono === profesorData.telefono);

        if (dniExiste) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El DNI ingresado ya está registrado en otro profesor.',
            confirmButtonText: 'Aceptar'
          });
          return;
        }

        if (telefonoExiste) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El teléfono ingresado ya está registrado en otro profesor.',
            confirmButtonText: 'Aceptar'
          });
          return;
        }

        // Si no hay duplicados, agregar profesor
        this.profesoresService.agregar(profesorData).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Profesor Agregado',
              text: 'El profesor ha sido agregado correctamente.'
            }).then(() => {
              this.profesorForm.reset();
              this.router.navigate(['/profesores']);
            });
          },
          error: (err) => {
            console.error('Error al agregar profesor:', err);
            this.mensajeError = 'Error al agregar profesor';
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
          text: 'Hubo un problema al verificar los datos. Inténtalo nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
}