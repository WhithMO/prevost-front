import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumnosService } from '../../../core/services/alumnos.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-alumno-edit',
  imports: [CommonModule, ReactiveFormsModule], // 👈 Agregar ReactiveFormsModule aquí
  templateUrl: './alumno-edit.component.html',
  styleUrl: './alumno-edit.component.css'
})
export class AlumnoEditComponent implements OnInit {
  alumnoForm: FormGroup;
  codigoAlumno: string = '';
  fechaNacimientoOriginal: string = '';

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.alumnoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]]
    });
  }

  ngOnInit(): void {
    this.codigoAlumno = this.route.snapshot.params['idalumno'];
    console.log('Código del alumno:', this.codigoAlumno);

    if (this.codigoAlumno) {
      this.obtenerAlumno(this.codigoAlumno);
    }
  }
  irAAlumnos() {
    this.router.navigate(['/alumnos']);
  }

  dniOriginal:string='';

  actualizarAlumno(): void {
      if (this.alumnoForm.invalid) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor, complete todos los campos correctamente.',
        });
        return;
      }
  
      const nuevoDni = this.alumnoForm.value.dni;
  
      // Si el DNI no cambió, actualizar directamente
      if (nuevoDni === this.dniOriginal) {
        this.guardarCambios();
        return;
      }
  
      // Verificar si el nuevo DNI ya está registrado en otro profesor
      this.alumnoService.listar().subscribe({
        next: (profesores) => {
          const dniExiste = profesores.some(prof => prof.dni === nuevoDni && prof.idAlumno !== this.codigoAlumno);
  
          if (dniExiste) {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'El DNI ingresado ya está registrado en otro profesor.',
              confirmButtonText: 'Aceptar'
            });
          } else {
            this.guardarCambios();
          }
        },
        error: (error) => {
          console.error('Error al verificar el DNI:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al verificar el DNI. Inténtalo nuevamente.',
            confirmButtonText: 'Cerrar'
          });
        }
      });
    }
    guardarCambios(): void {
      const alumnoActualizado = {
        idalumno: Number(this.codigoAlumno),
        nombre: this.alumnoForm.value.nombre,
        apellido: this.alumnoForm.value.apellido,
        dni: this.alumnoForm.value.dni,
        fechaNacimiento: this.fechaNacimientoOriginal
      };
        const alumno= Number(this.codigoAlumno);
        this.alumnoService.editar(alumno, alumnoActualizado).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Profesor actualizado correctamente.',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.router.navigate(['/alumnos']);
            });
          },
          error: (error) => {
            console.error('Error al actualizar el profesor:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al actualizar el profesor. Inténtalo nuevamente.',
              confirmButtonText: 'Cerrar'
            });
          }
        });
      }

  obtenerAlumno(id: string): void {
    this.alumnoService.buscar(id).subscribe({
      next: (alumno) => {
        if (alumno) {
          console.log('Alumno encontrado:', alumno);
          
          this.fechaNacimientoOriginal = alumno.fechaNacimiento;
          this.dniOriginal = alumno.dni;
  
          this.alumnoForm.patchValue({
            nombre: alumno.nombre,
            apellido: alumno.apellido,
            dni: alumno.dni
          });
        } else {
          console.error('Alumno no encontrado.');
        }
      },
      error: (error) => {
        console.error('Error al obtener el alumno:', error);
      }
    });
  }
  

  /*actualizarAlumno(): void {
    if (this.alumnoForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, complete todos los campos correctamente.',
      });
      return;
    }

    const alumnoActualizado = {
      idalumno: Number(this.codigoAlumno),
      nombre: this.alumnoForm.value.nombre,
      apellido: this.alumnoForm.value.apellido,
      dni: this.alumnoForm.value.dni,
      fechaNacimiento: this.fechaNacimientoOriginal
    };
    
    this.alumnoService.editaridtexto(this.codigoAlumno, alumnoActualizado).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Alumno actualizado con éxito.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/alumnos']);
        });
      },
      error: (error) => {
        console.error('Error al actualizar el alumno:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.error?.message || 'Error desconocido',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }*/
}
