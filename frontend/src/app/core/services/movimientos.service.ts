import { Injectable } from '@angular/core';
import { Movimiento } from '../models/movimiento.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' 
})
export class MovimientosService {
  
  private apiUrl = 'http://localhost:3000/movimientos'

  constructor(private http: HttpClient) {}


  getProductos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.apiUrl);
  }

  crearMovimiento(movimiento: Omit<Movimiento, 'id'>): Observable<Movimiento> {
    return this.http.post<Movimiento>(this.apiUrl, movimiento);
  }
}