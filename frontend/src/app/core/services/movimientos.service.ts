
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, forkJoin, map, catchError, throwError } from 'rxjs';

import {
  Movimiento,
  MovimientoApi,
  MovimientoPayload
} from '../models/movimiento.model';

import { ProductosService } from './productos.service';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {

  private http = inject(HttpClient);
  private productosService = inject(ProductosService);

  private readonly apiUrl =
    'http://localhost:8000/api/v1/movimientos/';

  getMovimientos(): Observable<Movimiento[]> {

    return forkJoin({
      movimientos: this.http.get<MovimientoApi[]>(this.apiUrl),
      productos: this.productosService.getProductos()
    }).pipe(
      map(({ movimientos, productos }) => {

        return movimientos.map(m => {

          const producto = productos.find(
            p => p.id === m.producto
          );

          return {
            id: m.id_movimiento,
            fecha: m.fecha,
            producto: producto?.nombre ?? `Producto ${m.producto}`,
            categoria: producto?.categoria ?? 'Sin categoría',
            tipo: m.tipo,
            cantidad: m.cantidad,
            usuario: String(m.usuario)
          };

        });

      }),
      catchError(this.handleError)
    );
  }

  crearMovimiento(
    movimiento: MovimientoPayload
  ): Observable<MovimientoApi> {

    return this.http.post<MovimientoApi>(
      this.apiUrl,
      movimiento
    ).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error(
      'Error en la API de movimientos:',
      error.status,
      error.error
    );

    return throwError(() => error);
  }
}
