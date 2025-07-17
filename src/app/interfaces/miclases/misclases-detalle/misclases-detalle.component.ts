import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MisclasesService } from '../../../core/services/misclases.service';

@Component({
    selector: 'app-misclases-detalle',
    imports: [CommonModule, FormsModule],
    templateUrl: './misclases-detalle.component.html',
    styleUrls: ['./misclases-detalle.component.css']
})

export class MisclasesDetalleComponent implements OnInit {
  idClase: string = '';
  clase: any = {};
  alumnos: any[] = [];
  asistencias: any[] = [];
  modoEdicion: boolean = false;
  botonDeshabilitado: boolean = true;
  asistenciaYaRegistrada: boolean = false;
  esDiaCorrecto: boolean = false;
  esHoraCorrecta: boolean = false;

  constructor(
    private route: ActivatedRoute, 
    private misclasesService: MisclasesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.idClase = this.route.snapshot.paramMap.get('idClase') || '';
    if (this.idClase) {
      this.obtenerAsistencias();
    }
  }

  obtenerAsistencias(): void {
    this.misclasesService.obtenerClaseConAlumnos(this.idClase).subscribe({
      next: (data) => {
        console.log('🔍 Datos recibidos del backend:', data);
  
        if (data.length > 0) {
          const primerItem = data[0];
  
          // 🧾 Info general de la clase
          this.clase = {
            diaSemana: primerItem.diaSemana,
            horaInicio: primerItem.horaInicio,
            horaFin: primerItem.horaFin,
            idaula: primerItem.idaula,
            nombreAula: primerItem.nombreAula,
            fechaAsistencia: primerItem.fechaAsistencia
          };
  
          // 👥 Alumnos
          this.alumnos = data.map((item: any) => ({
            id: item.id,
            nombreAlumno: `${item.nombreAlumno} ${item.apellidoAlumno}`,
            estado: item.estado || 'Sin registrar',
            idasistencia: item.idasistencia ?? null,
            idaula: item.idaula,
            nombreAula: item.nombreAula,
            diaSemana: item.diaSemana,
            horaInicio: item.horaInicio,
            horaFin: item.horaFin,
            fechaAsistencia: item.fechaAsistencia
          }));
  
          // 🧾 Asistencias por separado (opcional)
          this.asistencias = data.map((item: any) => ({
            idasistencia: item.idasistencia ?? null,
            estado: item.estado === 'Sin registrar' ? '' : item.estado,
            fechaAsistencia: item.fechaAsistencia
          }));
  
          console.log('✅ Clase cargada:', this.clase);
          console.log('✅ Alumnos:', this.alumnos);
          console.log('✅ Asistencias:', this.asistencias);
  
          this.verificarHorario();
          this.verificarEstados();
        }
      },
      error: (error) => {
        console.error('❌ Error al obtener asistencias:', error);
      }
    });
  }
  

  verificarHorario(): void {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const hoy = new Date();
    const diaHoy = diasSemana[hoy.getDay()];

    this.esDiaCorrecto = this.clase.diaSemana === diaHoy;

    const convertirAHoraNumero = (hora: string): number => {
        const [h, m] = hora.split(":").map(Number);
        return h * 60 + m;
    };

    const horaInicioNum = convertirAHoraNumero(this.clase.horaInicio);
    const horaFinNum = convertirAHoraNumero(this.clase.horaFin);
    const horaActualNum = hoy.getHours() * 60 + hoy.getMinutes();

    this.esHoraCorrecta = horaActualNum >= horaInicioNum && horaActualNum <= horaFinNum;
  }

  iniciarEdicion(): void {
    if (!this.esDiaCorrecto || !this.esHoraCorrecta) return;
    this.modoEdicion = true;
  }

  verificarEstados(): void {
    this.botonDeshabilitado = this.asistencias.some(asistencia => asistencia.estado === '' || asistencia.estado === undefined);
  }

  guardarCambios(): void {
    // 🔹 Filtrar solo los datos necesarios (idasistencia y estado)
    const asistenciasEditadas = this.asistencias
      .filter(asistencia => asistencia.idasistencia !== null && asistencia.idasistencia !== undefined) // Evitar registros sin id
      .map(asistencia => ({
        idasistencia: asistencia.idasistencia, // Solo enviar ID válido
        estado: asistencia.estado // Solo enviar estado actualizado
      }));
  
    console.log('📌 JSON enviado al backend:', asistenciasEditadas); // 🔍 Verificar antes de enviar
  
    if (asistenciasEditadas.length === 0) {
      this.snackBar.open('⚠ No hay asistencias válidas para actualizar.', 'Cerrar', { duration: 3000 });
      return;
    }
  
    this.misclasesService.editarAsistencias(asistenciasEditadas).subscribe(
      () => {
        this.snackBar.open('✅ Asistencias actualizadas correctamente', 'Cerrar', { duration: 3000 });
        this.modoEdicion = false;
        this.obtenerAsistencias();
      },
      (error) => {
        console.error('❌ Error al actualizar asistencias', error);
        this.snackBar.open('⚠ Error al actualizar asistencias', 'Cerrar', { duration: 3000 });
      }
    );
  }
}