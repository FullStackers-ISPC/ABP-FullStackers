import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ProductoApi, ProductoPayload } from '../models/producto.model';
import { ProductosService } from './productos.service';

describe('ProductosService', () => {
  let service: ProductosService;
  let httpMock: HttpTestingController;

  const url = 'http://localhost:8000/api/v1/productos/';

  const productoApi: ProductoApi = {
    id_producto: 1,
    codigo: 'CPU-001',
    nombre: 'AMD Ryzen 7 9800X3D',
    descripcion: null,
    stock_actual: 15,
    stock_alerta: 10,
    stock_critico: 5,
    precio: '450.00',
    categoria: 1,
    categoria_nombre: 'Procesadores',
    activo: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(ProductosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('lista productos y los traduce a la forma del frontend', () => {
    service.getProductos().subscribe((productos) => {
      expect(productos).toEqual([{
        id: 1,
        codigo: 'CPU-001',
        nombre: 'AMD Ryzen 7 9800X3D',
        categoria: 'Procesadores',
        idCategoria: 1,
        stock: 15,
        stockAlerta: 10,
        stockCritico: 5,
        precio: 450,
        descripcion: undefined,
      }]);
    });

    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('GET');
    request.flush([productoApi]);
  });

  it('envía los datos al backend con los nombres de Django al crear', () => {
    const payload: ProductoPayload = {
      codigo: 'CPU-001',
      nombre: 'AMD Ryzen 7 9800X3D',
      idCategoria: 1,
      stock: 15,
      stockAlerta: 10,
      stockCritico: 5,
      precio: 450,
    };

    service.crearProducto(payload).subscribe();

    const request = httpMock.expectOne(url);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({
      codigo: 'CPU-001',
      nombre: 'AMD Ryzen 7 9800X3D',
      descripcion: null,
      stock_actual: 15,
      stock_alerta: 10,
      stock_critico: 5,
      precio: 450,
      categoria: 1,
    });
    request.flush(productoApi, { status: 201, statusText: 'Created' });
  });

  it('elimina un producto mediante DELETE', () => {
    service.eliminarProducto(1).subscribe();

    const request = httpMock.expectOne(`${url}1/`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('devuelve solo los productos con stock en alerta o crítico, ordenados por stock', () => {
    service.getProductosConBajoStock().subscribe((productos) => {
      expect(productos.map((p) => p.id)).toEqual([2]);
    });

    httpMock.expectOne(url).flush([
      productoApi,
      { ...productoApi, id_producto: 2, stock_actual: 3 },
    ]);
  });
});