import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { Categoria } from '../models/categoria.model';
import { CategoriasService } from './categorias.service';

describe('CategoriasService', () => {
  let service: CategoriasService;
  let httpMock: HttpTestingController;

  const categoria: Categoria = {
    id_categoria: 1,
    nombre: 'Procesadores',
    descripcion: 'CPUs de escritorio.',
    cantidad_productos: 3,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(CategoriasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lista categorías desde la API Django', () => {
    service.getCategorias().subscribe((categorias) => {
      expect(categorias).toEqual([categoria]);
    });

    const request = httpMock.expectOne('http://localhost:8000/api/v1/categorias/');
    expect(request.request.method).toBe('GET');
    request.flush([categoria]);
  });

  it('elimina una categoría mediante DELETE', () => {
    service.eliminarCategoria(1).subscribe();

    const request = httpMock.expectOne('http://localhost:8000/api/v1/categorias/1/');
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
  });
});
