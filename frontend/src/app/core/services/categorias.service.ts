import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { Categoria, CategoriaPayload } from '../models/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {

  private readonly apiUrl = 'http://localhost:8000/api/v1/categorias/';

  constructor(private http: HttpClient) {}

  getCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl).pipe(
      catchError(this.handleError)
    );
  }

  getCategoriaById(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  crearCategoria(categoria: CategoriaPayload): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria).pipe(
      catchError(this.handleError)
    );
  }

  actualizarCategoria(id: number, categoria: CategoriaPayload): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${id}`, categoria).pipe(
      catchError(this.handleError)
    );
  }

  eliminarCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}/`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {

      console.error('Ocurrió un error de red:', error.error);
    } else {

      console.error(
        `El servidor respondió con el código ${error.status}, cuerpo: `, error.error
      );
    }

    return throwError(() => error);
  }
}
