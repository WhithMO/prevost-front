import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { MisclasesService } from '../../../core/services/misclases.service';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-reportedetalle',
  standalone:true,
  imports: [CommonModule, FormsModule, NgxPaginationModule],
  templateUrl: './reportedetalle.component.html',
  styleUrl: './reportedetalle.component.css'
})
export class ReportedetalleComponent implements OnInit{

  idClase: string = '';
  clase: any = {};
  alumnos: any[] = [];
  asistencias: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private misclasesService: MisclasesService
  ) {}

  ngOnInit(): void {
    this.idClase = this.route.snapshot.paramMap.get('idClase') || '';
    if (this.idClase) {
      this.obtenerAsistencias();
    } else {
      console.error('❌ No se encontró el parámetro idClase en la ruta');
    }
  }

  obtenerAsistencias(): void {
    this.misclasesService.obtenerClaseConAlumnos(this.idClase).subscribe({
      next: (data) => {
        console.log('🔍 Datos recibidos del backend:', data);
  
        if (!data || data.length === 0) return;
  
        const primerItem = data[0];
  
        // 📘 Info de la clase
        this.clase = {
          diaSemana: primerItem.diaSemana,
          horaInicio: primerItem.horaInicio,
          horaFin: primerItem.horaFin,
          idaula: primerItem.idaula,
          nombreAula: primerItem.nombreAula
        };
  
        // 👥 Alumnos + datos de asistencia
        this.alumnos = data.map((item: any) => {
          const fecha = item.fechaAsistencia
            ? new Date(item.fechaAsistencia).toLocaleDateString()
            : 'Sin registrar';
  
          return {
            id: item.idalumno,
            nombreAlumno: item.nombreAlumno,
            apellidoAlumno: item.apellidoAlumno,
            estado: item.estado ?? 'Sin registrar',
            idasistencia: item.idasistencia ?? null,
            diaSemana: item.diaSemana,
            horaInicio: item.horaInicio,
            horaFin: item.horaFin,
            nombreAula: item.nombreAula,
            idaula: item.idaula,
            fechaAsistencia: fecha
          };
        });
  
        // 🧾 Asistencias (opcional)
        this.asistencias = data.map((item: any) => ({
          idasistencia: item.idasistencia ?? null,
          estado: item.estado ?? 'Sin registrar'
        }));
  
        console.log('✅ Clase:', this.clase);
        console.log('✅ Alumnos:', this.alumnos);
      },
      error: (error) => {
        console.error('❌ Error al obtener asistencias:', error);
      }
    });
  }
  
  exportarPDF(): void {
    if (!this.alumnos.length) return;
  
    const doc = new jsPDF('p', 'mm', 'a4');
  
    // 🏷️ Título principal
    doc.setFontSize(18);
    doc.setTextColor(33, 37, 41); // Gris oscuro
    doc.text("Reporte de Asistencias", 105, 20, { align: 'center' });
  
    // 📅 Fecha de generación
    const fechaGeneracion = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Fecha de generación: ${fechaGeneracion}`, 10, 28);
  
    // 📘 Detalles de la Clase (caja con fondo suave)
    const alumnoEjemplo = this.alumnos[0];
    const yStart = 35;
  
    doc.setFillColor(230, 240, 255); // Azul muy suave
    doc.roundedRect(10, yStart, 190, 30, 2, 2, 'F'); // Caja visual
  
    doc.setFontSize(11);
    doc.setTextColor(33, 33, 33);
    doc.text("Detalles de la Clase:", 12, yStart + 6);
    doc.setFontSize(10);
    doc.text(`Aula: ${alumnoEjemplo.nombreAula}`, 12, yStart + 12);
    doc.text(`Día: ${alumnoEjemplo.diaSemana}`, 12, yStart + 18);
    doc.text(`Horario: ${alumnoEjemplo.horaInicio} - ${alumnoEjemplo.horaFin}`, 12, yStart + 24);
    doc.text(`Fecha de Asistencia: ${alumnoEjemplo.fechaAsistencia}`, 100, yStart + 12);
  
    // 🧾 Datos para la tabla
    const data = this.alumnos.map(alumno => [
      `${alumno.nombreAlumno} ${alumno.apellidoAlumno}`,
      alumno.nombreAula,
      `${alumno.horaInicio} - ${alumno.horaFin}`,
      alumno.estado,
      alumno.fechaAsistencia
    ]);
  
    // 📋 Tabla elegante
    (doc as any).autoTable({
      head: [['Alumno', 'Aula', 'Horario', 'Estado', 'Fecha']],
      body: data,
      startY: yStart + 40,
      theme: 'striped',
      headStyles: {
        fillColor: [0, 112, 192], // Azul
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: [33, 33, 33],
        fontSize: 10
      },
      alternateRowStyles: {
        fillColor: [245, 250, 255]
      },
      columnStyles: {
        0: { halign: 'left' },
        1: { halign: 'center' },
        2: { halign: 'center' },
        3: { halign: 'center' },
        4: { halign: 'center' }
      }
    });
  
    // 📄 Pie de página
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
  
      // Firma opcional
      doc.setFontSize(8);
      doc.text("Generado automáticamente por el sistema", 10, 290);
    }
  
    // 💾 Guardar
    doc.save('reporte_asistencias.pdf');
  }
  
  
  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Asistencias');
  
    const azulOscuro = '0070C0';
    const azulClaro = 'D9E1F2';
    const blanco = 'FFFFFF';
  
    // 🎨 Título
    worksheet.mergeCells('A1', 'F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Reporte de Asistencias';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: blanco } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: azulOscuro } };
  
    worksheet.addRow([]);
  
    const alumnoEjemplo = this.alumnos[0];
  
    // 🧾 Detalles de la clase con formato mejorado
    const detalles = [
      ['Aula:', alumnoEjemplo.nombreAula],
      ['Día:', alumnoEjemplo.diaSemana],
      ['Hora Inicio:', alumnoEjemplo.horaInicio],
      ['Hora Final:', alumnoEjemplo.horaFin]
    ];
  
    worksheet.addRow(['Detalles de la Clase']);
    const detalleHeader = worksheet.getRow(3);
    detalleHeader.font = { bold: true };
    detalleHeader.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: azulClaro }
    };
  
    detalles.forEach((detalle, i) => {
      const row = worksheet.addRow(detalle);
      row.eachCell(cell => {
        cell.alignment = { horizontal: 'left' };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
      });
    });
  
    worksheet.addRow([]);
  
    // 📋 Título de tabla
    worksheet.addRow(['Lista de Asistencias']);
    worksheet.getRow(9).getCell(1).font = { bold: true };
  
    // 🧾 Encabezado de tabla
    const headerRow = worksheet.addRow(['N°', 'Alumno', 'Aula', 'Horario', 'Estado', 'Fecha']);
    headerRow.eachCell(cell => {
      cell.font = { bold: true, color: { argb: blanco } };
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
    this.alumnos.forEach((alumno, index) => {
      const row = worksheet.addRow([
        index + 1,
        `${alumno.nombreAlumno} ${alumno.apellidoAlumno}`,
        alumno.nombreAula,
        `${alumno.horaInicio} - ${alumno.horaFin}`,
        alumno.estado,
        alumno.fechaAsistencia
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
      { key: 'nro', width: 6 },
      { key: 'alumno', width: 30 },
      { key: 'aula', width: 15 },
      { key: 'horario', width: 20 },
      { key: 'estado', width: 15 },
      { key: 'fecha', width: 15 }
    ];
  
    // 💾 Guardar
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const fecha = new Date().toISOString().split('T')[0];
      FileSaver.saveAs(blob, `reporte_asistencias_${fecha}.xlsx`);
    });
  }  
  
}
