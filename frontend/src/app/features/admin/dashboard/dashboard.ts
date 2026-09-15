import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movimiento, MovimientosService } from '../../../core/services/movimientos.service';
import { ProductosService } from '../../../core/services/productos.service'; 
import { Producto } from '../../../core/models/producto.model';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [RouterLink, TitleCasePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {
  private movimientosService = inject(MovimientosService);
  private productosService = inject(ProductosService); 
  private cdr = inject(ChangeDetectorRef);
  
  
  movimientos: Movimiento[] = [];
  productosStockBajo: Producto[] = []; 

  ngOnInit(): void {
    this.movimientos = this.movimientosService.getMovimientos();

    this.productosService.getProductosConBajoStock().subscribe({
      next: (data) => {
        this.productosStockBajo = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar productos con bajo stock:', err);
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