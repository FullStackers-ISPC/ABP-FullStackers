import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =
    'http://localhost:3000/usuarios';

  constructor(
    private http: HttpClient
  ) {}

  login(
    email: string,
    password: string
  ): Observable<Usuario[]> {

    const params = new HttpParams()
      .set(
        'email',
        email.trim().toLowerCase()
      )
      .set(
        'password',
        password
      );

    return this.http.get<Usuario[]>(
      this.apiUrl,
      { params }
    );
  }

  registrar(
    usuario: Usuario
  ): Observable<Usuario> {

    return this.http.post<Usuario>(
      this.apiUrl,
      usuario
    );
  }

  buscarPorEmail(
    email: string
  ): Observable<Usuario[]> {

    const params = new HttpParams()
      .set(
        'email',
        email.trim().toLowerCase()
      );

    return this.http.get<Usuario[]>(
      this.apiUrl,
      { params }
    );
  }

}