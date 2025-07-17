import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, TemplateRef } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { FullCalendarModule } from '@fullcalendar/angular'; 
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ClasesService } from '../../../core/services/clases.service';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-clase-listar',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [RouterModule, CommonModule, NgxPaginationModule, FullCalendarModule],
  templateUrl: './clase-listar.component.html',
  styleUrl: './clase-listar.component.css'
})
export class ClaseListarComponent implements OnInit {

  modalRef?: BsModalRef;
  claseSeleccionada: any = {};
  templateModal?: TemplateRef<any>;

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
    eventClick: this.abrirModal.bind(this)
  };

  constructor(
    private clasesService: ClasesService,
    private modalService: BsModalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cargarClases();
  }

  cargarClases(): void {
    this.clasesService.listar().subscribe(clases => {
      const eventos = clases.map(clase => {
        const start = this.combinarFechaYHora(clase.fechadeclase, clase.horaInicio);
        const end = this.combinarFechaYHora(clase.fechadeclase, clase.horaFin);

        if (!start || !end) {
          console.warn('Clase ignorada por datos inválidos:', clase);
          return null;
        }

        return {
          title: `${clase.curso.nombre} - ${clase.aula.nombre}`,
          start,
          end,
          extendedProps: clase
        };
      }).filter(e => e !== null);

      this.calendarOptions.events = eventos;
    });
  }

  combinarFechaYHora(fechadeclase: any, hora: string): string {
    try {
      let year, month, day;
  
      // Verificar si viene como array [yyyy, mm, dd, ...]
      if (Array.isArray(fechadeclase)) {
        year = fechadeclase[0];
        month = (fechadeclase[1]).toString().padStart(2, '0'); // Sin restar 1 porque es desde backend
        day = fechadeclase[2].toString().padStart(2, '0');
      } else {
        const fechaObj = new Date(fechadeclase);
        if (isNaN(fechaObj.getTime())) throw new Error("Fecha inválida");
  
        year = fechaObj.getFullYear();
        month = (fechaObj.getMonth() + 1).toString().padStart(2, '0');
        day = fechaObj.getDate().toString().padStart(2, '0');
      }
  
      const fechaString = `${year}-${month}-${day}T${hora}:00`;
      const resultado = new Date(fechaString);
  
      return resultado.toISOString();
    } catch (e) {
      console.error('⛔ Error combinando fecha y hora:', e, 'Valor:', fechadeclase);
      return '';
    }
  }
  

  getFechaLocal(fecha: any): string {
    let fechaObj: Date;
  
    if (Array.isArray(fecha)) {
      // Formato [YYYY, MM, DD, HH, mm]
      const [y, m, d, h = 0, min = 0] = fecha;
      fechaObj = new Date(y, m - 1, d, h, min); // ⚠️ Mes -1 porque en JS enero es 0
    } else {
      fechaObj = new Date(fecha);
    }
  
    if (isNaN(fechaObj.getTime())) {
      console.warn('Fecha inválida en getFechaLocal:', fecha);
      return 'Fecha inválida';
    }
  
    return new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(fechaObj);
  }
  

  abrirModal(eventInfo: EventClickArg): void {
    this.claseSeleccionada = eventInfo.event.extendedProps;
    if (this.templateModal) {
      this.modalRef = this.modalService.show(this.templateModal);
    }
  }

  irAEditarClase(): void {
    const id = this.claseSeleccionada?.idClase;
    if (id) {
      this.modalRef?.hide();
      this.router.navigate(['/clases/editar', id]);
    } else {
      console.warn('No se encontró idClase en claseSeleccionada:', this.claseSeleccionada);
    }
  }

  setTemplate(template: TemplateRef<any>) {
    this.templateModal = template;
  }
}
