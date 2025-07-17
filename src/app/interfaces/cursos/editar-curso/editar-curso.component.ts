import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CursoService } from '../../../core/services/curso.service';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-editar-curso',
  templateUrl: './editar-curso.component.html',
  styleUrls: ['./editar-curso.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})

export class EditarCursoComponent implements OnInit {
  curso: any = {};
  cursoId!: number;
  nombreOriginal!: string; // Guarda el nombre original del curso

  constructor(
    private cursoService: CursoService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cursoId = Number(this.route.snapshot.paramMap.get('idcurso'));
    if (!isNaN(this.cursoId)) {
      this.obtenerCurso(this.cursoId);
    } else {
      Swal.fire({
        icon: 'error',
        title: 'ID de curso inválido',
        text: 'El ID del curso no es válido.',
      });
    }
  }
  irACursos() {
    this.router.navigate(['/cursos']);
  }
  obtenerCurso(id: number): void {
    this.cursoService.buscaridNumber(id).subscribe({
      next: (curso) => {
        if (curso) {
          this.nombreOriginal = curso.nombre; // Guardamos el nombre original
          this.curso = {
            idcurso: curso.idcurso,
            nombre: curso.nombre,
            descripcion: curso.descripcion
          };
        } else {
          console.error('Curso no encontrado.');
        }
      },
      error: (err) => {
        console.error('Error al obtener el curso:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error al cargar curso',
          text: 'No se pudo cargar la información del curso.',
        });
      }
    });
  }

  editarCurso(): void {
    if (!this.curso.nombre || !this.curso.descripcion) {
      Swal.fire({
        icon: 'error',
        title: 'Formulario inválido',
        text: 'Por favor, complete todos los campos correctamente.',
      });
      return;
    }

    const nuevoNombre = this.curso.nombre;

    // Si el nombre no cambió, actualizar directamente
    if (nuevoNombre === this.nombreOriginal) {
      this.guardarCambios();
      return;
    }

    // Verificar si el nuevo nombre ya está registrado en otro curso
    this.cursoService.listar().subscribe({
      next: (cursos) => {
        const nombreExiste = cursos.some(curso => curso.nombre.toLowerCase() === nuevoNombre.toLowerCase() && curso.idcurso !== this.cursoId);

        if (nombreExiste) {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'El nombre del curso ya está registrado en otro curso.',
            confirmButtonText: 'Aceptar'
          });
        } else {
          this.guardarCambios();
        }
      },
      error: (error) => {
        console.error('Error al verificar el nombre:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Hubo un problema al verificar el nombre del curso. Inténtalo nuevamente.',
          confirmButtonText: 'Cerrar'
        });
      }
    });
  }

  guardarCambios(): void {
    this.cursoService.editar(this.cursoId, this.curso).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Curso Actualizado',
          text: 'El curso se ha actualizado correctamente.',
        }).then(() => {
          this.router.navigate(['/cursos']);
        });
      },
      error: (err) => {
        console.error('Error al actualizar el curso:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar el curso. Intenta nuevamente.',
        });
      }
    });
  }
}