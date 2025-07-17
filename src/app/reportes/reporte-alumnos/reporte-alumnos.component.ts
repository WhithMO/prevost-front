import { Component, OnInit } from '@angular/core';
import { ReporteAlumnosService } from '../../core/services/reportes/reporte-alumnos.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';
import { AlumnosService } from '../../core/services/alumnos.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-reporte-alumnos',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, NgSelectModule, NgxPaginationModule],
  templateUrl: './reporte-alumnos.component.html',
  styleUrl: './reporte-alumnos.component.css'
})
export class ReporteAlumnosComponent implements OnInit {
  nombreBusqueda: number | null = null;
  alumnos: any[] = [];
  alumnoSeleccionado: any = null; 
  busquedaRealizada = false;
  listaAllumno: any[] = [];
  page: number = 1;
  itemsPerPage: number = 8;
  reportes: any[] = []; 

  constructor(private reporteService: ReporteAlumnosService, private alumnoService: AlumnosService) {}

  ngOnInit(): void {
      this.cargarAlumno();
  }

  cargarAlumno(): void {
    this.alumnoService.listar().subscribe({
      next: (aulaData) => {
        this.listaAllumno = aulaData.map((a: any) => ({
          ...a,
          nombreCompleto: `${a.nombre} ${a.apellido}`
        }));
      },
      error: (error) => {
        console.error('Error al cargar Alumnos:', error);
      }
    });
  }

  contador: any = {
    presente: 0,
    tardanza: 0,
    ausente: 0,
    justificacion: 0
  }

  contarAsistencia() {
    this.contador = {
      presente: 0,
      tardanza: 0,
      ausente: 0,
      justificacion: 0
    };

    this.alumnos.forEach(a => {
      const estado = a.estadoAsistencia?.toUpperCase();
        if (estado === 'PRESENTE')
      this.contador.presente++;
        else if (estado === 'TARDANZA')
      this.contador.tardanza++;
        else if (estado === 'AUSENTE')
          this.contador.ausente++;
        else if (estado === 'JUSTIFICADO')
       this.contador.justificacion++;
    })
  }

  obtenerDatos() {
    if (this.nombreBusqueda !== null && this.nombreBusqueda !== undefined) {
      this.reporteService.obtenerAsistencias(this.nombreBusqueda).subscribe({
        next: (data) => {
          this.alumnos = data;
          this.busquedaRealizada = true;
          console.log('Datos recibidos:', data);
          this.contarAsistencia();
        },
        error: (err) => {
          console.error('Error al obtener datos', err);
          this.alumnos = [];
          this.busquedaRealizada = true;
        }
      });
    }
  }

  onPageChange(event: number): void {
    this.page = event;
  }
  
  exportarPDF(): void {
    if (!this.alumnos.length) return;
  
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const headerImageUrl = `${window.location.origin}/image.png`;
    const imageHeight = 60;
  
    // 📷 Logo (NO tocar 😅)
    doc.addImage(headerImageUrl, 'PNG', 0, 0, pageWidth, imageHeight);
  
    const startY = imageHeight + 10;
  
    // 🎓 Alumno y aula
    const alumno = this.alumnos[0];
    const nombreCompleto = `${alumno.nombreAlumno} ${alumno.apellidoAlumno}`;
    const aula = alumno.aula;
  
    doc.setFontSize(13);
    doc.setTextColor(33, 33, 33);
    doc.setFont('helvetica', 'bold');
    doc.text(`Alumno:`, 10, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(nombreCompleto, 40, startY);
  
    doc.setFont('helvetica', 'bold');
    doc.text(`Aula:`, pageWidth - 50, startY);
    doc.setFont('helvetica', 'normal');
    doc.text(aula, pageWidth - 30, startY);
  
    const tableStartY = startY + 10;
  
    // 🧾 Cabecera tabla
    const head = [['N°', 'Curso', 'Estado', 'Fecha']];
    const data = this.alumnos.map((asistencia, index) => [
      index + 1,
      asistencia.curso || '',
      asistencia.estadoAsistencia || '',
      new Date(asistencia.fechaAsistencia).toLocaleDateString('es-PE')
    ]);
  
    (doc as any).autoTable({
      startY: tableStartY,
      head: head,
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [102, 0, 0], // Bordó
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 11,
        halign: 'center'
      },
      bodyStyles: {
        textColor: [50, 50, 50],
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: [255, 240, 240]
      },
      columnStyles: {
        0: { halign: 'center', cellWidth: 15 }, // N°
        1: { halign: 'center', cellWidth: 60 }, // Curso
        2: { halign: 'center', cellWidth: 55 }, // Estado
        3: { halign: 'center', cellWidth: 55 }  // Fecha
      },
      styles: {
        lineColor: [102, 0, 0],
        lineWidth: 0.5
      }
    });
  
    // 📊 Contadores
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Resumen de Asistencia:', 10, finalY);
  
    const cont = this.contador; // contadores que ya usas en HTML
    const resumen = `Presente: ${cont.presente}     Tardanza: ${cont.tardanza}     Ausente: ${cont.ausente}     Justificado: ${cont.justificacion}`;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(resumen, 10, finalY + 7);
  
    // 📄 Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, pageWidth / 2, 290, { align: 'center' });
    }
  
    // 💾 Guardar
    doc.save('reporte_asistencia.pdf');
  }
  
  
  
  exportarExcel(): void {
    if (!this.alumnos.length) return;
  
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Historial de Asistencia');
  
    // 🎯 Título
    worksheet.mergeCells('A1', 'F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Reporte de Historial de Alumnos';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0070C0' }
    };
  
    worksheet.addRow([]);
  
    // 🧾 Encabezados
    const headers = ['Nombre', 'Apellido', 'Aula', 'Curso', 'Estado', 'Fecha'];
    const headerRow = worksheet.addRow(headers);
  
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      cell.alignment = { horizontal: 'center' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4472C4' }
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
  
    // 👥 Datos
    this.alumnos.forEach(asistencia => {
      const row = worksheet.addRow([
        asistencia.nombreAlumno,
        asistencia.apellidoAlumno,
        asistencia.aula,
        asistencia.curso,
        asistencia.estadoAsistencia,
        new Date(asistencia.fechaAsistencia).toLocaleDateString()
      ]);
  
      row.eachCell(cell => {
        cell.alignment = { horizontal: 'center' };
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
  
    // 📐 Ancho de columnas
    worksheet.columns = [
      { key: 'nombre', width: 20 },
      { key: 'apellido', width: 20 },
      { key: 'aula', width: 20 },
      { key: 'curso', width: 25 },
      { key: 'estado', width: 15 },
      { key: 'fecha', width: 18 }
    ];
  
    // 💾 Descargar
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, 'reporte_historial_alumno.xlsx');
    });
  }
  
}
