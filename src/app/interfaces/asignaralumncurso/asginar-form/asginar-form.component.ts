import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlumnosService } from '../../../core/services/alumnos.service';
import { ClasesService } from '../../../core/services/clases.service';
import { AsginaralumnocursoService } from '../../../core/services/asginaralumnocurso.service';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-asginar-form',
  standalone: true,
  imports: [CommonModule,NgxPaginationModule,ReactiveFormsModule],
  templateUrl: './asginar-form.component.html',
  styleUrl: './asginar-form.component.css'
})

export class AsignarFormComponent implements OnInit {
  alumnoClaseForm!: FormGroup;
  listaAlumnos: any[] = [];
  listaClases: any[] = [];
  alumnosSeleccionados: number[] = [];


  constructor(
    private fb: FormBuilder,
    private alumnosService: AlumnosService,
    private clasesService: ClasesService,
    private alumnoClaseService: AsginaralumnocursoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarListas();
  }

  inicializarFormulario(): void {
    this.alumnoClaseForm = this.fb.group({
      idClase: [null, Validators.required]
    });
  }
  irAAsignar() {
    this.router.navigate(['/asignarclases']);
  }
  cargarListas(): void {
    this.alumnosService.listar().subscribe({
      next: (data) => {
        this.listaAlumnos = data;
      },
      error: (error) => {
        console.error('Error al cargar alumnos:', error);
      }
    });

    this.clasesService.listar().subscribe({
      next: (data) => {
        this.listaClases = data;
      },
      error: (error) => {
        console.error('Error al cargar clases:', error);
      }
    });
  }

  toggleSeleccionAlumno(idAlumno: number): void {
    const index = this.alumnosSeleccionados.indexOf(idAlumno);
    if (index > -1) {
      this.alumnosSeleccionados.splice(index, 1);
    } else {
      this.alumnosSeleccionados.push(idAlumno);
    }
  }
  
  

  guardarAlumnoClase(): void {
    if (this.alumnoClaseForm.invalid) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos incompletos',
        text: 'Seleccione al menos una clase antes de asignar.',
      });
      return;
    }
  
    if (this.alumnosSeleccionados.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Debe seleccionar al menos un alumno para asignar.',
      });
      return;
    }
  
    const idClase = this.alumnoClaseForm.value.idClase;
  
    this.alumnoClaseService.asignarGrupoAlumnos(idClase, this.alumnosSeleccionados).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Alumnos asignados correctamente a la clase.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.alumnoClaseForm.reset();
          this.alumnosSeleccionados = [];
        });
      },
      error: (error) => {
        console.error('Error al asignar alumnos:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al asignar los alumnos. Inténtalo nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }
  
}