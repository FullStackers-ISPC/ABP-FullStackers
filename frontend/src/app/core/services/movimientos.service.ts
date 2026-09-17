import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movimiento } from '../models/movimiento.model';
import { Producto } from '../models/producto.model';

@Injectable({
  providedIn: 'root'
})
export class MovimientosService {
  // el servicio centra el acceso HTTP a los recursos de movimientos y mantiene la separacion
  // con el servicio de producto que es responsable de /productos
  private movimientosUrl = 'http://localhost:3000/movimientos';
  private productosUrl = 'http://localhost:3000/productos';

  // el backend del proyecto usa HttpClient para consumir la API REST del archivo db.json
  constructor(private http: HttpClient) {}

  // GET /movimientos devuelve el historial real del dashboard de usuario y del panel admin
  getMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.movimientosUrl);
  }

  // este método queda como compatibilidad de nombres con el proyecto, pero no debe consultar el historial de movimientos
  // el endpoint correcto para productos sigue estando en ProductosService
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.productosUrl);
  }

  // POST /movimientos registra un movimiento nuevo y devuelve la entidad creada por json-server
  crearMovimiento(movimiento: Omit<Movimiento, 'id'>): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.movimientosUrl, movimiento);
  }
}