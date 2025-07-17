import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Profesor, ProfesoresService } from '../../../core/services/profesores.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';  // Importa SweetAlert2

@Component({
  selector: 'app-editar-profesor',
  imports: [CommonModule, FormsModule, ReactiveFormsModule ],
  templateUrl: './editar-profesor.component.html',
  styleUrls: ['./editar-profesor.component.css']
})

export class EditarProfesorComponent implements OnInit {
  profesorForm!: FormGroup;  
  profesorId!: number;
  dniOriginal!: string; // Guardar el DNI original para verificar cambios
  telefonoOrginal:string ='';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private profesoresService: ProfesoresService
  ) {
    this.profesorForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      apellido: ['', [Validators.required, Validators.minLength(3)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      especialidad: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('idprofesor');
    if (id) {
      this.profesorId = Number(id);
      this.cargarProfesor(this.profesorId);
    }
  }
  irAProfesores() {
    this.router.navigate(['/profesores']);
  }
  cargarProfesor(id: number): void {
    this.profesoresService.buscaridNumber(id).subscribe({
      next: (profesor) => {
        if (profesor) {
          this.dniOriginal = profesor.dni; // Guardamos el DNI original
          this.telefonoOrginal = profesor.telefono;
          this.profesorForm.patchValue({
            nombre: profesor.nombre,
            apellido: profesor.apellido,
            dni: profesor.dni,
            especialidad: profesor.especialidad,
            telefono: profesor.telefono
          });
        } else {
          console.error('Profesor no encontrado.');
        }
      },
      error: (error) => {
        console.error('Error al cargar el profesor', error);
      }
    });
  }

  

  actualizarProfesor(): void {
    if (this.profesorForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Por favor, complete todos los campos correctamente.',
      });
      return;
    }

    const nuevoDni = this.profesorForm.value.dni;
    const nuevoTelefono = this.profesorForm.value.telefono;

    // Si el DNI no cambió, actualizar directamente
    if (nuevoDni === this.dniOriginal && nuevoTelefono === this.telefonoOrginal) {
      this.guardarCambios();
      return;
    }

    // Verificar si el nuevo DNI ya está registrado en otro profesor
    this.profesoresService.listar().subscribe({
      next: (profesores) => {
        const dniExiste = profesores.some(prof => prof.dni === nuevoDni && prof.idprofesor !== this.profesorId);
        const telefonoExiste = profesores.some(prof => Number(prof.telefono) === Number(nuevoTelefono) && prof.idprofesor !== this.profesorId);
 
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
 
      // Si no hay errores, proceder con la actualización
      this.guardarCambios();
        
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
    const profesorActualizado = {
      idprofesor: this.profesorId,
      ...this.profesorForm.value
    };

    this.profesoresService.editar(this.profesorId, profesorActualizado).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Profesor actualizado correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/profesores']);
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
}