import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  stock: number;
  stockAlerta: number;
  stockCritico: number;
  precio: number;
  descripcion?: string;
}

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
}