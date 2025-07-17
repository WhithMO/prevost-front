import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AulasService } from '../../../core/services/aulas.service';
import { CursoService } from '../../../core/services/curso.service';
import { ProfesoresService } from '../../../core/services/profesores.service';
import { ClasesService } from '../../../core/services/clases.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clase-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './clase-edit.component.html',
  styleUrl: './clase-edit.component.css'

})export class ClaseEditComponent implements OnInit {

  claseForm: FormGroup;
  idClase: string = '';

  aulas: any[] = [];
  cursos: any[] = [];
  profesores: any[] = [];

  ngOnInit(): void {
    this.idClase = this.route.snapshot.params['id'];

    this.obtenerAulas();
    this.obtenerCurso();
    this.obtenerProfesor();

    if (this.idClase) {
      this.obtenerClase(this.idClase);
    }
  }
  
    constructor(
      private fb: FormBuilder,
      private route: ActivatedRoute,
      private claseService: ClasesService,
      private aulaService: AulasService,
      private cursoService: CursoService,
      private profesorService: ProfesoresService,
      private router: Router
    ) {
      this.claseForm = this.fb.group({
        diaSemana: ['', Validators.required],
        horaInicio: ['', Validators.required],
        horaFin: ['', Validators.required],
        fechadeclase: ['', Validators.required],
        idcurso: ['', Validators.required],
        idprofesor: ['', Validators.required],
        idaula: ['', Validators.required]
      });
    }

    obtenerAulas(): void {
      this.aulaService.listar().subscribe({
        next: (data) => {
          this.aulas = data;
        },
        error: (error) => {
          console.error('Error al obtener aulas:', error);
        }
      });
    }

    obtenerCurso(): void {
      this.cursoService.listar().subscribe({
        next: (data) => {
          this.cursos = data;
        },
        error: (error) => {
          console.error('Error al obtener cursos:', error);
        }
      });
    }

    obtenerProfesor(): void {
      this.profesorService.listar().subscribe({
        next: (data) => {
          this.profesores = data;
        },
        error: (error) => {
          console.error('Error al obtener profesores:', error);
        }
      });
    }

    obtenerClase(id: string): void {
      this.claseService.buscar(id).subscribe({
        next: (clase) => {
          const fechaFormateada = this.parsearFechaAInput(clase.fechadeclase);

          this.claseForm.patchValue({
            diaSemana: clase.diaSemana,
            horaInicio: clase.horaInicio,
            horaFin: clase.horaFin,
            fechadeclase: fechaFormateada,
            idcurso: clase.curso.idcurso,
            idprofesor: clase.profesor.idprofesor,
            idaula: clase.aula.idaula
          });
          
        },
        error: (error) => {
          console.error('Error al obtener la clase:', error);
        }
      });
    }

    actualizarClase(): void {
      if (this.claseForm.invalid) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor, complete todos los campos correctamente.',
        });
        return;
      }
  
      const claseActualizada = {
        idClase: Number(this.idClase),
        diaSemana: this.claseForm.value.diaSemana,
        horaInicio: this.claseForm.value.horaInicio,
        horaFin: this.claseForm.value.horaFin,
        fechadeclase: this.claseForm.value.fechadeclase + 'T00:00:00',
        curso: { idcurso: this.claseForm.value.idcurso },
        profesor: { idprofesor: this.claseForm.value.idprofesor },
        aula: { idaula: this.claseForm.value.idaula }
      };
  
      this.claseService.editaridtexto(this.idClase, claseActualizada).subscribe({
        
        next: () => {
          console.log('json: ' + claseActualizada)
          Swal.fire({
            icon: 'success',
            title: 'Clase actualizada',
            text: 'La clase ha sido actualizada correctamente.',
            
          }).then(() => {
            this.router.navigate(['/clases']);
          });
        },
        error: (error) => {
          console.log('json: ' + claseActualizada)
          console.error('Error al actualizar la clase:', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.error?.message || 'Error desconocido'
          });
        }
      });
    }

    actualizarDiaSemana(): void {
      const fechaValor = this.claseForm.value.fechadeclase;
      if (!fechaValor) return;
    
      const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
      const fecha = new Date(fechaValor);
      const diaSemanaCalculado = diasSemana[fecha.getDay()];
    
      this.claseForm.patchValue({ diaSemana: diaSemanaCalculado });
    }

    parsearFechaAInput(fecha: any): string {
      let fechaObj: Date;
    
      if (Array.isArray(fecha)) {
        const [y, m, d, h = 0, min = 0] = fecha;
        fechaObj = new Date(y, m - 1, d, h, min); // mes -1
      } else {
        fechaObj = new Date(fecha);
      }
    
      if (isNaN(fechaObj.getTime())) {
        console.warn('Fecha inválida al parsear:', fecha);
        return '';
      }
    
      const year = fechaObj.getFullYear();
      const month = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
      const day = fechaObj.getDate().toString().padStart(2, '0');
    
      return `${year}-${month}-${day}`;
    }

    

    irAClases(): void {
      this.router.navigate(['/clases']);
    }
}

