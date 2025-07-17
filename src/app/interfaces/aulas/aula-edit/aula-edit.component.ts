import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AulasService } from '../../../core/services/aulas.service';
import { CommonModule } from '@angular/common';
import { AlumnosService } from '../../../core/services/alumnos.service';

@Component({
  selector: 'app-aula-edit',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './aula-edit.component.html',
  styleUrl: './aula-edit.component.css'
})

export class AulaEditComponent implements OnInit {

  aulaForm!: FormGroup;
  alumnosDisponibles: any[] = [];
  alumnosSeleccionados: any[] = [];
  idaula!: number;
  mensajeError: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private aulaService: AulasService,
    private alumnoService: AlumnosService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.idaula = Number(this.route.snapshot.paramMap.get('idaula'));
    
    this.aulaForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      capacidad: [1, [Validators.required, Validators.min(1)]]
    });

    this.cargarDatosAula();
  }

  cargarDatosAula() {
    this.aulaService.buscaridNumber(this.idaula).subscribe({
      next: (aula) => {
        this.aulaForm.patchValue({
          nombre: aula.nombre,
          capacidad: aula.capacidad
        });
      },
      error: (err) => console.error('Error al cargar aula:', err)
    });
  
    this.aulaService.obtenerAlumnosPorAula(this.idaula).subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.alumnosSeleccionados = data.map(alumno => ({
            idalumno: alumno.alumno.idalumno, 
            nombre: alumno.alumno.nombre, 
            apellido: alumno.alumno.apellido
          }));
        } else {
          this.alumnosSeleccionados = [];
        }
      },
      error: (err) => console.error('Error al obtener alumnos del aula:', err)
    });
  
    this.alumnoService.obtenerAlumnosPorAula().subscribe({
      next: (data) => {
        this.alumnosDisponibles = data.filter(alumno =>
          !this.alumnosSeleccionados.some(sel => sel.idalumno === alumno.idalumno)
        );
      },
      error: (err) => console.error('Error al obtener alumnos:', err)
    });
  }
  
  

  agregarAlumno(event: any) {
    const idAlumno = Number(event.target.value);
    const alumno = this.alumnosDisponibles.find(a => a.idalumno === idAlumno);

    if (!alumno) return;

    if (this.alumnosSeleccionados.some(a => a.idalumno === idAlumno)) {
      Swal.fire({ icon: 'warning', title: 'Alumno Duplicado', text: 'Este alumno ya ha sido agregado.' });
      return;
    }

    if (this.alumnosSeleccionados.length >= this.aulaForm.value.capacidad) {
      Swal.fire({ icon: 'warning', title: 'Capacidad Excedida', text: 'No puedes agregar más alumnos.' });
      return;
    }

    this.alumnosSeleccionados.push(alumno);
  }

  eliminarAlumno(id: number) {
    this.alumnosSeleccionados = this.alumnosSeleccionados.filter(a => a.idalumno !== id);
  }

  actualizarAula() {
    if (this.aulaForm.invalid) {
      Swal.fire({ icon: 'error', title: 'Campos Incompletos', text: 'Por favor completa todos los campos correctamente.' });
      return;
    }
  
    const aulaData = {
      nombre: this.aulaForm.value.nombre,
      capacidad: this.aulaForm.value.capacidad,
      alumnosIds: this.alumnosSeleccionados.map(a => a.idalumno)
    };
  
    this.aulaService.actualizarAula(this.idaula, aulaData).subscribe({
      next: () => {
        Swal.fire({ icon: 'success', title: 'Aula Actualizada', text: 'Los cambios se guardaron correctamente.' })
          .then(() => this.router.navigate(['/aulas']));
      },
      error: (err) => {
        console.error('Error al actualizar aula:', err);
        Swal.fire({ icon: 'error', title: 'Error', text: 'Hubo un problema al actualizar el aula.' });
      }
    });
  }
  
  irAAulas() {
    this.router.navigate(['/aulas']);
  }
}