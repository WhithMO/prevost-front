import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { JustificacionesService } from '../../../core/services/justificaciones.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-justificacion-revisar',
  standalone: true,
  imports: [RouterModule, CommonModule, NgxPaginationModule, FormsModule ],
  templateUrl: './justificacion-revisar.component.html',
  styleUrl: './justificacion-revisar.component.css'
})
export class JustificacionRevisarComponent implements OnInit {

    justificacion: any = null;
    nuevoEstado: string = '';
  
    constructor(
      private route: ActivatedRoute,
      private justificacionesService: JustificacionesService,
      private router: Router
    ) {}
  
    ngOnInit(): void {
      const idjustificacion = this.route.snapshot.paramMap.get('idjustificacion');
      if (idjustificacion) {
        this.obtenerJustificacion(parseInt(idjustificacion));
      }
    }
  
    obtenerJustificacion(id: number): void {
      this.justificacionesService.buscaridNumber(id).subscribe({
        next: (data) => {
          this.justificacion = data;
          this.nuevoEstado = data.asistencia.estado; // Asigna el estado actual
        },
        error: (error) => {
          console.error('Error al obtener justificación:', error);
        }
      });
    }
  
    guardarEstado(): void {
      if (!this.justificacion) return;
    
      const idjustificacion = this.justificacion.idjustificacion;
      const nuevoEstadoData = { estado: this.nuevoEstado };
    
      this.justificacionesService.actualizarEstado(idjustificacion, nuevoEstadoData).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Estado actualizado',
            text: 'El estado de la justificación ha sido actualizado correctamente.',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            this.router.navigate(['/justificaciones']); // 🔹 Redirigir a la lista después de guardar
          });
        },
        error: (error) => {
          if (error.status === 200) {
            // 🔹 Si el error es un 200, lo tratamos como éxito y redirigimos igual
            Swal.fire({
              icon: 'success',
              title: 'Estado actualizado',
              text: 'El estado de la justificación ha sido actualizado correctamente.',
              confirmButtonText: 'Aceptar'
            }).then(() => {
              this.router.navigate(['/justificaciones']);
            });
          } else {
            console.error('❌ Error real al actualizar estado:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo actualizar el estado. Intente nuevamente.',
              confirmButtonText: 'Cerrar'
            });
          }
        }
      });
    }    
    
    descargarArchivo(): void {
      if (!this.justificacion || !this.justificacion.archivo) {
        Swal.fire('Error', 'No se encontró el archivo para descargar.', 'error');
        return;
      }
    
      const nombreArchivo = this.justificacion.archivo.split('/').pop(); // extrae solo el nombre
    
      this.justificacionesService.descargarArchivo(nombreArchivo!).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = nombreArchivo!;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('❌ Error al descargar el archivo:', error);
          Swal.fire('Error', 'No se pudo descargar el archivo.', 'error');
        }
      });
    }
    
    
    regresar(): void {
      this.router.navigate(['/justificaciones']);
    }

}
