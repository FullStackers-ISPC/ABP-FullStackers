import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Usuario, LoginResponse } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api/v1/usuarios';

  constructor(private http: HttpClient) {}

  /**
   * POST /api/v1/auth/login/
   * Autenticación contra Django por email y contraseña.
   */
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login/`, {
      email: email.trim().toLowerCase(),
      password: password
    }).pipe(
      tap((res) => {
        // Guarda la sesión en localStorage para mantenerla al recargar
        localStorage.setItem('usuario_actual', JSON.stringify(res));
      })
    );
  }

  /**
   * POST /api/v1/auth/registro/
   * Envía los datos para crear el registro en la base de datos.
   */
  registrar(usuario: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(`${this.apiUrl}/registro/`, usuario);
  }

  /**
   * GET /api/v1/usuarios/:id/
   * Obtiene la información del usuario por id_usuario.
   */
  obtenerUsuario(id_usuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id_usuario}/`);
  }

  /**
   * Cierra sesión eliminando los datos guardados en el navegador.
   */
  logout(): void {
    localStorage.removeItem('usuario_actual');
  }

  /**
   * Retorna el objeto del usuario logueado actualmente o null.
   */
  getUsuarioActual(): LoginResponse | null {
    const data = localStorage.getItem('usuario_actual');
    return data ? JSON.parse(data) : null;
  }

  /**
   * Comprueba si el usuario tiene una sesión activa.
   */
  estaAutenticado(): boolean {
    return this.getUsuarioActual() !== null;
  }
}