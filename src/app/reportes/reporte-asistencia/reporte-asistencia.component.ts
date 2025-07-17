import { Component, AfterViewInit, ViewChild, ElementRef, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { ReporteAsistenciaService } from '../../core/services/reportes/reporte-asistencia.service';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AulasService } from '../../core/services/aulas.service';
import * as ExcelJS from 'exceljs';
import * as FileSaver from 'file-saver';


@Component({
  selector: 'app-reporte-asistencia',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule,NgxPaginationModule],
  templateUrl: './reporte-asistencia.component.html',
  styleUrls: ['./reporte-asistencia.component.css']
})
export class ReporteAsistenciaComponent implements OnInit {

  estadoSeleccionado: string = '';
  aulaSeleccionada: number | null = null;
  fechaInicio: string = '';
  fechaFin: string = '';
  reportes: any[] = []; 
  
  listaaula: any[] = [];
  idProfesor: string = '';
  
  page: number = 1;
  itemsPerPage: number = 8;
  
  alumnoSeleccionado: any = null; // 🔹 Declarar correctamente


  
  constructor(private misclasesService: ReporteAsistenciaService, private aulaServices: AulasService) {}
  
  ngOnInit(): void {
    this.cargarAula();
    this.obtenerUsuarioAutenticado()
  }

  obtenerUsuarioAutenticado(): void {
    this.idProfesor = localStorage.getItem('codprofesor') || '';
    if (this.idProfesor) {
      this.obtenerDatos();
    }
  }
  
  obtenerDatos(): void {
    const idProfNum = this.idProfesor ? parseInt(this.idProfesor, 10) : undefined;
    const idProfesorFinal = idProfNum === 1 ? undefined : idProfNum;
  
    this.misclasesService.obtenerReportes(
      this.estadoSeleccionado || undefined,
      this.aulaSeleccionada !== null ? this.aulaSeleccionada : undefined,
      this.fechaInicio || undefined,
      this.fechaFin || undefined,
      idProfesorFinal
    ).subscribe({
      next: (data) => {
        this.reportes = data;
      },
      error: (error) => {
        console.error('❌ Error al obtener datos:', error);
      }
    });
  }
  
  
  

  cargarAula(): void {
    this.aulaServices.listar().subscribe({
      next: (aulaData) => {
        this.listaaula = aulaData;
      },
      error: (error) => {
        console.error('Error al cargar aulas:', error);
      }
    });
  }

  seleccionarAlumno(reporte: any): void {
    console.log('📌 Clic en alumno:', reporte);
  
    if (!reporte.id) {
      console.warn("⚠ El reporte no tiene un ID válido.");
      return;
    }
  
    // Asignación correcta basada en el JSON devuelto
    this.alumnoSeleccionado = {
      id: reporte.id, // Usamos reporte.id
      nombrealumno: reporte.nombrecompleto, // Usamos reporte.nombrecompleto
      aula: reporte.nombre, // Usamos reporte.nombre
      asistencias: [
        {
          curso: reporte.curso, // Usamos reporte.curso
          estado: reporte.estado, // Usamos reporte.estado
          profesor: reporte.nombreprofesor, // Usamos reporte.profesor
          fecha: reporte.fechaclase // Usamos reporte.fechaclase
        }
      ]
    };
  
    console.log('✅ Alumno seleccionado:', this.alumnoSeleccionado);
  }

  exportarPDF() {
    console.log('📄 Generando PDF con imagen desde /public/image.png...');
    console.log('🔍 Reportes:', this.reportes);
  
    const doc = new jsPDF('p', 'mm', 'a4');
    const headerImageUrl = `${window.location.origin}/image.png`;
    const pageWidth = doc.internal.pageSize.getWidth();
    const imageHeight = 60;
  
    doc.addImage(headerImageUrl, 'PNG', 0, 0, pageWidth, imageHeight);
    const startY = imageHeight + 10;
  
    const head = [['N°', 'Alumno', 'Estado', 'Aula', 'Curso', 'Profesor', 'Fecha']];
  
    let data = this.reportes.map((reporte: any, index: number) => [
      index + 1,
      reporte.nombrecompleto || '',
      reporte.estado || '',
      reporte.nombre || '',
      reporte.curso || '',
      reporte.nombreprofesor || '',
      reporte.fechaclase || ''
    ]);
  
    const tableWidth = 202;
    const marginLeft = (pageWidth - tableWidth) / 2;
  
    (doc as any).autoTable({
      startY: startY,
      tableWidth: 'auto',
      margin: { left: marginLeft },
      head: head,
      body: data,
      theme: 'grid',
      headStyles: {
        fillColor: [100, 0, 0],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
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
        0: { halign: 'center', cellWidth: 10 },
        1: { halign: 'left', cellWidth: 50 },
        2: { halign: 'center', cellWidth: 20 },
        3: { halign: 'center', cellWidth: 20 },
        4: { halign: 'center', cellWidth: 35 },
        5: { halign: 'center', cellWidth: 42 },
        6: { halign: 'center', cellWidth: 25 }
      },
      styles: {
        lineColor: [100, 0, 0],
        lineWidth: 0.5
      }
    });
  
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
    }
  
    doc.save(`reporte_asistencia.pdf`);
  }

  exportarExcel(): void {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Reporte');
  
    // 🎨 Título bonito
    worksheet.mergeCells('A1', 'F1');
    const titleCell = worksheet.getCell('A1');
    titleCell.value = 'Reporte de Asistencias';
    titleCell.font = { name: 'Arial', size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
    titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '0070C0' }
    };
  
    worksheet.addRow([]);
  
    // 🧾 Encabezados
    const headers = ['Alumno', 'Estado', 'Aula', 'Curso', 'Profesor', 'Fecha'];
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
  
    // 👥 Agregar filas
    this.reportes.forEach(reporte => {
      const row = worksheet.addRow([
        reporte.nombrecompleto,
        reporte.estado,
        reporte.nombre,
        reporte.curso,
        reporte.nombreprofesor,
        reporte.fechaclase
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
  
    // 📐 Ajustar ancho de columnas
    worksheet.columns = [
      { key: 'alumno', width: 30 },
      { key: 'estado', width: 15 },
      { key: 'aula', width: 20 },
      { key: 'curso', width: 20 },
      { key: 'profesor', width: 25 },
      { key: 'fecha', width: 18 }
    ];
  
    // 💾 Guardar el archivo
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      FileSaver.saveAs(blob, 'reporte_asistencias.xlsx');
    });
  }
  
  
  onPageChange(event: number): void {
    this.page = event;
  }

}