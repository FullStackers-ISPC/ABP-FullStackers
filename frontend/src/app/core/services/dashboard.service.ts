import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Movimiento } from '../models/movimiento.model';
import { Producto } from '../models/producto.model';
import { MovimientosService } from './movimientos.service';
import { ProductosService } from './productos.service';

export interface DashboardData {
  availableProducts: number;
  movementsToday: number;
  lowStockProducts: Producto[];
  movements: Movimiento[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  constructor(
    private readonly productosService: ProductosService,
    private readonly movimientosService: MovimientosService
  ) {}

  getDashboardData(): Observable<DashboardData> {
    return forkJoin({
      products: this.productosService.getProductos(),
      movements: this.movimientosService.getMovimientos()
    }).pipe(
      map(({ products, movements }) => {
        const today = new Date();
        const lowStockProducts = products
          .filter((product) => product.stock <= product.stockAlerta)
          .sort((first, second) => first.stock - second.stock);

        return {
          availableProducts: products.filter((product) => product.stock > 0).length,
          movementsToday: movements.filter((movement) => this.isToday(movement.fecha, today)).length,
          lowStockProducts,
          movements
        };
      })
    );
  }

  private isToday(value: string, today: Date): boolean {
    const spanishDate = value.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    const movementDate = spanishDate
      ? new Date(Number(spanishDate[3]), Number(spanishDate[2]) - 1, Number(spanishDate[1]))
      : new Date(value);

    return !Number.isNaN(movementDate.getTime())
      && movementDate.getFullYear() === today.getFullYear()
      && movementDate.getMonth() === today.getMonth()
      && movementDate.getDate() === today.getDate();
  }
}