import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { Producto } from '../../../core/models/producto.model';
import { Movimiento } from '../../../core/models/movimiento.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private cdr = inject(ChangeDetectorRef);

  isLoadingDashboard = true;
  dashboardErrorMessage = '';
  productosDisponibles = 0;
  movimientosHoy = 0;
  movimientos: Movimiento[] = [];
  productosStockBajo: Producto[] = [];

  ngOnInit(): void {
    this.dashboardService.getDashboardData().subscribe({
      next: (data) => {
        this.productosDisponibles = data.availableProducts;
        this.movimientosHoy = data.movementsToday;
        this.movimientos = data.movements;
        this.productosStockBajo = data.lowStockProducts;
        this.isLoadingDashboard = false;
        this.dashboardErrorMessage = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar los datos del dashboard:', err);
        this.isLoadingDashboard = false;
        this.dashboardErrorMessage = 'No se pudieron cargar los datos del panel. Verificá la conexión e intentá nuevamente.';
        this.cdr.detectChanges();
      }
    });
  }

  getEstado(prod: Producto): { texto: string, clase: string } {
    if (prod.stock <= prod.stockCritico) {
      return { texto: 'Crítico', clase: 'badge-critico' };
    } else if (prod.stock <= prod.stockAlerta) {
      return { texto: 'Alerta', clase: 'badge-alerta' };
    } else {
      return { texto: 'Normal', clase: 'badge-ok' };
    }
  }
}