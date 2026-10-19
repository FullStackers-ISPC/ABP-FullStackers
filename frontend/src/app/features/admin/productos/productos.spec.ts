import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { ProductosComponent } from './productos';
import { ProductosService } from '../../../core/services/productos.service';
import { Producto } from '../../../core/models/producto.model';

describe('ProductosComponent', () => {
  let component: ProductosComponent;
  let fixture: ComponentFixture<ProductosComponent>;

  const productos: Producto[] = [
    {
      id: 1, codigo: 'CPU-001', nombre: 'AMD Ryzen 7 9800X3D', categoria: 'Procesadores',
      idCategoria: 1, stock: 15, stockAlerta: 10, stockCritico: 5, precio: 450,
    },
    {
      id: 2, codigo: 'GPU-001', nombre: 'RTX 5070 Ti 16GB', categoria: 'Tarjetas Gráficas',
      idCategoria: 2, stock: 3, stockAlerta: 10, stockCritico: 5, precio: 750,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductosComponent],
      providers: [
        provideRouter([]),
        {
          provide: ProductosService,
          useValue: {
            getProductos: () => of(productos),
            eliminarProducto: () => of(void 0),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductosComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carga los productos desde el servicio', () => {
    expect(component.productos.length).toBe(2);
    expect(component.cargando).toBe(false);
  });

  it('calcula el estado según el stock', () => {
    expect(component.getEstado(productos[0]).texto).toBe('Normal');
    expect(component.getEstado(productos[1]).texto).toBe('Crítico');
  });

  it('filtra por texto y por categoría', () => {
    component.busqueda = 'ryzen';
    expect(component.productosFiltrados.map((p) => p.id)).toEqual([1]);

    component.busqueda = '';
    component.categoriaFiltro = 'Tarjetas Gráficas';
    expect(component.productosFiltrados.map((p) => p.id)).toEqual([2]);
  });
});
