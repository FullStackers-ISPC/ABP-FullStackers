import { Component, inject, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movimiento, MovimientosService } from '../../../core/services/movimientos.service';
import { Producto, ProductosService } from '../../../core/services/productos.service'; // IMPORTANTE

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private movimientosService = inject(MovimientosService);
  private productosService = inject(ProductosService); // INYECTAMOS
  
  movimientos: Movimiento[] = [];
  productosStockBajo: Producto[] = []; // NUEVA VARIABLE

  ngOnInit(): void {
    this.movimientos = this.movimientosService.getMovimientos();
    this.productosStockBajo = this.productosService.getProductosConBajoStock();
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