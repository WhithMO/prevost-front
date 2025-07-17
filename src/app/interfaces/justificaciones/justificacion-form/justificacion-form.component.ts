import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { JustificacionesService } from '../../../core/services/justificaciones.service';
import { AlumnosService } from '../../../core/services/alumnos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-justificacion-form',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxPaginationModule, FormsModule, ReactiveFormsModule],
  templateUrl: './justificacion-form.component.html',
  styleUrl: './justificacion-form.component.css'
})
export class JustificacionFormComponent implements OnInit {

  justificacionForm!: FormGroup;
  listapendientes: any[] = [];
  idProfesor: string = '';

  constructor(
    private fb: FormBuilder,
    private justificacionesService: JustificacionesService,
    private router: Router
  ) {
    this.justificacionForm = this.fb.group({
      justificacionSeleccionada: [null, Validators.required],
      nombreApellido: [{ value: '', disabled: true }],
      fechaJustificacion: [{ value: '', disabled: true }],
      estado: [{ value: '', disabled: true }],
      nombrecurso: [{ value: '', disabled: true }],
      motivo: ['', [Validators.required, Validators.minLength(10)]],
      evidencia: [null]
    });
  }

  ngOnInit(): void {
    this.obtenerUsuarioAutenticado();
  }

  obtenerUsuarioAutenticado(): void {
    this.idProfesor = localStorage.getItem('codprofesor') || '';

    if (this.idProfesor) {
      this.cargarJustificacionesPendientes();
    }
  }

  cargarJustificacionesPendientes(): void {
    this.justificacionesService.obtenerJustificaciones(this.idProfesor).subscribe({
      next: (pendientes) => {
        this.listapendientes = pendientes;
      },
      error: (error) => {
        console.error('Error al cargar justificaciones pendientes:', error);
      }
    });
  }

  cargarDatosJustificacion(): void {
    const idSeleccionado = this.justificacionForm.value.justificacionSeleccionada;
    console.log("ID seleccionado:", idSeleccionado);

    const justificacion = this.listapendientes.find(j => j.idasistencia == idSeleccionado);
    
    if (justificacion) {
      console.log("Justificación encontrada:", justificacion);
      
      this.justificacionForm.patchValue({
        nombreApellido: `${justificacion.nombre} ${justificacion.apellido}`,
        fechaJustificacion: this.convertirFecha(justificacion.fecha),
        nombrecurso: justificacion.nombrecurso,
        estado: justificacion.estado
      });

      console.log("Formulario actualizado:", this.justificacionForm.value);
    }
  }

  convertirFecha(fechaMillis: any): string {
    if (!fechaMillis) return '';
    const fecha = new Date(fechaMillis);
    return fecha.toISOString().split('T')[0];
  }

  registrarJustificacion(): void {
    if (this.justificacionForm.invalid || !this.archivoSeleccionado) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, complete todos los campos y adjunte un archivo.',
      });
      return;
    }
  
    // Obtener fecha actual en formato yyyy-MM-dd
    const hoy = new Date();
    const fechaFormateada = hoy.toISOString().split('T')[0]; // '2025-03-26'
  
    // Armar FormData
    const formData = new FormData();
    formData.append('motivo', this.justificacionForm.value.motivo);
    formData.append('fechaPresentacion', fechaFormateada);
    formData.append('idProfesor', this.idProfesor.toString());
    formData.append('idAsistencia', this.justificacionForm.value.justificacionSeleccionada.toString());
    formData.append('archivo', this.archivoSeleccionado); // 📎 archivo tipo File
  
    console.log('📦 FormData enviado:', formData);
  
    this.justificacionesService.agregarJustificacion(formData).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Justificación registrada correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/justificaciones']);
        });
      },
      error: (error) => {
        console.error('Error al registrar justificación:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo registrar la justificación. Intente nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  archivoSeleccionado: File | null = null;

  onArchivoSeleccionado(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }
  

cancelar(): void {
    this.router.navigate(['/justificaciones']);
  }
}
