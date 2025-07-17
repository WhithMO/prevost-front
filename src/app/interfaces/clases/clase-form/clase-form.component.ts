import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CursoService } from '../../../core/services/curso.service';
import { ProfesoresService } from '../../../core/services/profesores.service';
import { AulasService } from '../../../core/services/aulas.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { ClasesService } from '../../../core/services/clases.service';

@Component({
  selector: 'app-clase-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clase-form.component.html',
  styleUrl: './clase-form.component.css'
})
export class ClaseFormComponent implements OnInit {
  claseForm!: FormGroup;
  listacurso: any[] = [];
  listaprofesor: any[] = [];
  listaaula: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cursoService: CursoService,
    private profesorService: ProfesoresService,
    private aulaService: AulasService,
    private claseService: ClasesService,
    private router: Router
  ) {
    this.claseForm = this.fb.group({
      idcurso: [null, Validators.required],
      idaula: [null, Validators.required],
      idprofesor: [null, Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required],
      fechadeclase: ['', Validators.required],
      diaSemana: ['']
    });
  }

  ngOnInit(): void {
    this.cargarCurso();
    this.cargarProfesor();
    this.cargarAula();
  }

  cargarCurso(): void {
    this.cursoService.listar().subscribe({
      next: (cursosData) => this.listacurso = cursosData,
      error: (error) => console.error('Error al cargar cursos:', error)
    });
  }

  cargarProfesor(): void {
    this.profesorService.listar().subscribe({
      next: (profesorData) => this.listaprofesor = profesorData,
      error: (error) => console.error('Error al cargar profesores:', error)
    });
  }

  cargarAula(): void {
    this.aulaService.listar().subscribe({
      next: (aulaData) => this.listaaula = aulaData,
      error: (error) => console.error('Error al cargar aulas:', error)
    });
  }

  obtenerDiaSemana(fecha: Date): string {
    const diasSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return diasSemana[fecha.getDay()];
  }

  actualizarDiaSemana(): void {
    const fechaValor = this.claseForm.value.fechadeclase;
    const horaValor = this.claseForm.value.horaInicio || '00:00';

    if (!fechaValor) return;

    const fechaCompleta = new Date(`${fechaValor}T${horaValor}:00`);
    const diaSemanaCalculado = this.obtenerDiaSemana(fechaCompleta);

    this.claseForm.patchValue({ diaSemana: diaSemanaCalculado });
  }

  agregarClase(): void {
    if (this.claseForm.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, complete todos los campos correctamente.',
      });
      return;
    }

    const fechaSeleccionada = this.claseForm.value.fechadeclase; // Ej: "2025-03-28"
    const horaInicio = this.claseForm.value.horaInicio;          // Ej: "12:00"
    const fechaHoraCompleta = new Date(`${fechaSeleccionada}T${horaInicio}:00`);

    const nuevaClase = {
      curso: { idcurso: this.claseForm.value.idcurso },
      aula: { idaula: this.claseForm.value.idaula },
      profesor: { idprofesor: this.claseForm.value.idprofesor },
      horaInicio: this.claseForm.value.horaInicio,
      horaFin: this.claseForm.value.horaFin,
      fechadeclase: fechaHoraCompleta,
      diaSemana: this.obtenerDiaSemana(fechaHoraCompleta)
    };

    console.log('Datos enviados:', nuevaClase);

    this.claseService.agregar(nuevaClase).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: '¡Éxito!',
          text: 'Clase agregada correctamente.',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/clases']);
        });
      },
      error: (error) => {
        console.error('Error al agregar clase:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar la clase. Intente nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/clases']);
  }
}
