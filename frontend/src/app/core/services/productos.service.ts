import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Producto, ProductoApi, ProductoPayload } from '../models/producto.model';

// Backend -> frontend
function aProducto(api: ProductoApi): Producto {
  return {
    id: api.id_producto,
    codigo: api.codigo,
    nombre: api.nombre,
    categoria: api.categoria_nombre,
    idCategoria: api.categoria,
    stock: api.stock_actual,
    stockAlerta: api.stock_alerta,
    stockCritico: api.stock_critico,
    precio: Number(api.precio),
    descripcion: api.descripcion ?? undefined,
  };
}

// Frontend -> backend
function aApi(p: ProductoPayload) {
  return {
    codigo: p.codigo,
    nombre: p.nombre,
    descripcion: p.descripcion ?? null,
    stock_actual: p.stock,
    stock_alerta: p.stockAlerta,
    stock_critico: p.stockCritico,
    precio: p.precio,
    categoria: p.idCategoria,
  };
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private readonly apiUrl = 'http://localhost:8000/api/v1/productos/';

  constructor(private http: HttpClient) {}

  getProductos(): Observable<Producto[]> {
    return this.http.get<ProductoApi[]>(this.apiUrl).pipe(
      map(lista => lista.map(aProducto)),
      catchError(this.handleError)
    );
  }

  getProductoById(id: number): Observable<Producto> {
    return this.http.get<ProductoApi>(`${this.apiUrl}${id}/`).pipe(
      map(aProducto),
      catchError(this.handleError)
    );
  }

  getProductosConBajoStock(): Observable<Producto[]> {
    return this.getProductos().pipe(
      map(productos =>
        productos
          .filter(prod => prod.stock <= prod.stockAlerta)
          .sort((a, b) => a.stock - b.stock)
      )
    );
  }

  crearProducto(producto: ProductoPayload): Observable<Producto> {
    return this.http.post<ProductoApi>(this.apiUrl, aApi(producto)).pipe(
      map(aProducto),
      catchError(this.handleError)
    );
  }

  actualizarProducto(id: number, producto: ProductoPayload): Observable<Producto> {
    return this.http.put<ProductoApi>(`${this.apiUrl}${id}/`, aApi(producto)).pipe(
      map(aProducto),
      catchError(this.handleError)
    );
  }

  eliminarProducto(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('Ocurrió un error de red:', error.error);
    } else {
      console.error(`El backend devolvió el código ${error.status}, body:`, error.error);
    }
    // Se relanza el error original para que cada pantalla muestre el mensaje del backend.
    return throwError(() => error);
  }
}