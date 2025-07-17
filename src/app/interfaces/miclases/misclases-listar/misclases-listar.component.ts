import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MisclasesService } from '../../../core/services/misclases.service';
import { LoginService } from '../../../core/services/login.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';


@Component({
  selector: 'app-misclases-listar',
  imports: [RouterModule, CommonModule, FullCalendarModule],
  templateUrl: './misclases-listar.component.html',
  styleUrl: './misclases-listar.component.css'
})
export class MisclasesListarComponent implements OnInit {
  clases: any[] = [];
  clasesFiltradas: any[] = [];
  idProfesor: string = '';
  diaActual: string = '';
  mostrarTodasLasClases: boolean = false;

  constructor(private misclasesService: MisclasesService, private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerUsuarioAutenticado();
  }

  
  obtenerUsuarioAutenticado(): void {
    this.idProfesor = localStorage.getItem('codprofesor') || '';

    if (this.idProfesor) {
      this.obtenerCursos();
    }
  }

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
    initialView: 'timeGridWeek',
    locale: 'es',
    height: 600,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día'
    },
    events: [],
    eventClick: this.irADetalleDesdeCalendario.bind(this) // <-- Aquí lo agregas
  };
  
  irADetalleDesdeCalendario(eventInfo: EventClickArg): void {
    const idClase = eventInfo.event.extendedProps['idClase'];

  
    if (idClase) {
      this.verDetalleClase(idClase);
    } else {
      console.warn('No se encontró idClase en el evento:', eventInfo.event.extendedProps);
    }
  }
  
  obtenerCursos(): void {
    this.misclasesService.obternerCursosProfesor(this.idProfesor).subscribe({
      next: (data) => {
        this.clases = data;
        this.filtrarClases();
      },
      error: (error) => {
        console.error('Error al obtener clases:', error);
      }
    });
  }

  filtrarClases(): void {
    if (this.mostrarTodasLasClases) {
      this.clasesFiltradas = [...this.clases];
  
      // cargar en el calendario
      const eventos = this.clases.map(clase => {
        const start = this.combinarFechaYHora(clase.fechadeclase, clase.horaInicio);
        const end = this.combinarFechaYHora(clase.fechadeclase, clase.horaFin);
  
        return {
          title: `${clase.curso} - ${clase.aula}`,
          start,
          end,
          extendedProps: clase
        };
      });
  
      this.calendarOptions.events = eventos;
    } else {
      const fechaActual = this.getFormattedDate(new Date().toISOString());
  
      this.clasesFiltradas = this.clases.filter(clase =>
        this.getFormattedDate(clase.fechadeclase) === fechaActual
      );
    }
  }
  
  combinarFechaYHora(fecha: string, hora: string): string {
    const date = new Date(fecha);
    const [h, m] = hora.split(':');
    date.setHours(+h);
    date.setMinutes(+m);
    return date.toISOString();
  }

  toggleFiltro(): void {
    this.mostrarTodasLasClases = !this.mostrarTodasLasClases;
    this.filtrarClases();
  }

  getFormattedDate(fecha: string): string {
    const f = new Date(fecha);
    const year = f.getFullYear();
    const month = (f.getMonth() + 1).toString().padStart(2, '0');
    const day = f.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  verDetalleClase(idClase: string): void {
    this.router.navigate(['/misclases/detalle', idClase]);
  }
}
