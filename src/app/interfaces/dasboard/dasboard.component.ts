import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { DashboardService } from '../../core/services/dashboard.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dasboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dasboard.component.html',
  styleUrl: './dasboard.component.css'
})

export class DasboardComponent implements OnInit {
  
  // Variables para el gráfico de barras
  estados: string[] = ['Presente', 'Ausente','Tardanza','Justificado'];
  estadoSeleccionado: string = 'Presente';
  inicio: number = 2022;
  fin: number = 2025;

  // Variables para el gráfico de pastel
  inicioPastel: string = '2022-01-01';
  finPastel: string = '2025-12-31';

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.obtenerDatosYGenerarGraficoBarras();
    this.obtenerDatosYGenerarGraficoPie();
  }

  // 🔹 Obtener datos para el gráfico de barras
  obtenerDatosYGenerarGraficoBarras(): void {
    this.dashboardService.ObtenerAnoCantidad(this.estadoSeleccionado, this.inicio, this.fin).subscribe({
      next: (datos) => {
        this.generarGraficoBarras(datos);
      },
      error: (err) => {
        console.error('Error al obtener los datos del gráfico de barras:', err);
      }
    });
  }
  
  obtenerDatosYGenerarGraficoPie(): void {
    this.dashboardService.ObtenerProcentajes(this.inicioPastel, this.finPastel).subscribe({
      next: (datos) => {
        const datosFiltrados = datos.filter((d: any) => d.name !== "Sin registrar");
  
        const totalFiltrado = datosFiltrados.reduce((acc: number, d: any) => acc + d.value, 0);
  
        const datosRecalculados = datosFiltrados.map((d: any) => ({
          name: d.name,
          value: parseFloat(((d.value / totalFiltrado) * 100).toFixed(2))
        }));
  
        this.generarGraficoPie(datosRecalculados);
      },
      error: (err) => {
        console.error('Error al obtener los datos del gráfico de pastel:', err);
      }
    });
  }
  
  // 🔹 Generar Gráfico de Barras
  generarGraficoBarras(datos: any): void {
    const chartDom = document.getElementById('barChart')!;
    
    // Destruir instancia previa para evitar errores
    let existingChart = echarts.getInstanceByDom(chartDom);
    if (existingChart) {
        existingChart.dispose();
    }

    const myChart = echarts.init(chartDom);
    const chartOption = {
      xAxis: {
        type: 'category',
        data: datos.anios
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          data: datos.cantidades,
          type: 'bar',
          showBackground: true,
          backgroundStyle: {
            color: 'rgba(180, 180, 180, 0.2)'
          }
        }
      ]
    };

    myChart.setOption(chartOption);
  }

// 🔹 Generar Gráfico de Pastel sin errores
generarGraficoPie(datos: any): void {
  const chartDom = document.getElementById('pieChart')!;

  // Verificar y eliminar instancia previa de ECharts correctamente
  let existingChart = echarts.getInstanceByDom(chartDom);
  if (existingChart) {
      echarts.dispose(existingChart); // Pasar la instancia existente
  }

  // Inicializar nuevo gráfico
  const myChart = echarts.init(chartDom);
  const chartOption = {
    title: {
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => `${params.name}: ${params.value}% (${params.percent}%)`
    },
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        name: 'Asistencia',
        type: 'pie',
        radius: '50%',
        data: datos.map((d: any) => ({ name: d.name, value: parseFloat(d.value.toFixed(2)) })), // Asegurar decimales correctos
        label: {
          formatter: (params: any) => `${params.name}: ${params.value}%`
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  myChart.setOption(chartOption);
}


  // 🔹 Método para actualizar ambos gráficos cuando se envía el formulario
  onSubmit(): void {
    this.obtenerDatosYGenerarGraficoBarras();
  }
}
