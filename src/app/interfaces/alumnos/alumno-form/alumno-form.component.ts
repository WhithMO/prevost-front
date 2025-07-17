import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Alumno, AlumnosService } from '../../../core/services/alumnos.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-alumno-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './alumno-form.component.html',
  styleUrl: './alumno-form.component.css'
})

export class AlumnoFormComponent implements OnInit {
  alumnoForm: FormGroup;
  mensajeError: string = '';
  alumnosTelefono: any[] = [];

  constructor(
    private fb: FormBuilder,
    private alumnoService: AlumnosService,
    private router: Router
  ) {
    this.alumnoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
    });
  }

  ngOnInit(): void {
    this.obtenerAlumnos();
  }
  irAAlumnos() {
    this.router.navigate(['/alumnos']);
  }
  obtenerAlumnos(): void {
    this.alumnoService.listar().subscribe({
      next: (data) => {
        this.alumnosTelefono = data.map((alumno: any) => alumno.telefono);
      },
      error: (error) => {
        console.error('Error al obtener alumnos:', error);
      }
    });
  }

  agregarAlumno(): void {
    if (this.alumnoForm.invalid) {
      this.mensajeError = 'Por favor, complete todos los campos correctamente.';
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: this.mensajeError,
      });
      return;
    }
  
    // 🔹 Usar fecha actual como fecha de registro
    const fechaNacimientoTimestamp = Date.now();
  
    const alumnoData = {
      nombre: this.alumnoForm.value.nombre,
      apellido: this.alumnoForm.value.apellido,
      dni: this.alumnoForm.value.dni,
      fechaNacimiento: fechaNacimientoTimestamp,
      telefono: this.alumnoForm.value.telefono
    };


    this.alumnoService.listar().subscribe({
      next: (alumnos) => {
        const dniExiste = alumnos.some(alum => alum.dni === alumnoData.dni);
  
        if (dniExiste) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El DNI ingresado ya está registrado en otro alumno.',
            confirmButtonText: 'Aceptar'
          });
          return;
        }
  
        this.alumnoService.agregar(alumnoData).subscribe({
          next: () => {
            
            Swal.fire({
              icon: 'success',
              title: '¡Éxito!',
              text: 'Alumno agregado correctamente.',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.alumnoForm.reset();
              this.router.navigate(['/alumnos']);
            });
          },
          error: (err) => {
            this.mensajeError = 'Error al agregar alumno';
            console.error('❌ Error al agregar alumno:', err);
      
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al registrar al alumno. Inténtalo nuevamente.',
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