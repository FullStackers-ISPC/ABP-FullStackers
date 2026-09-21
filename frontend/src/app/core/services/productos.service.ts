import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Producto } from '../models/producto.model';


@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = 'http://localhost:3000/productos'

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${id}`);
  }

  getProductosConBajoStock(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl).pipe(
      map(productos =>
        productos
          .filter(prod => prod.stock <= prod.stockAlerta)
          .sort((a, b) => a.stock - b.stock)
      )
    );
  }

  crearProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.apiUrl, producto).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Ocurrió un error de red:', error.error);
    } else {
      console.error(`El backend devolvió el código ${error.status}, body:`, error.error);
    }
    return throwError(() => new Error('No se pudo completar la operación con productos. Intentá nuevamente.'));
  }
}