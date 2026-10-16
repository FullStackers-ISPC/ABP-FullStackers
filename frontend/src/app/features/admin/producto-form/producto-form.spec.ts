import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { of } from 'rxjs';
import { vi } from 'vitest';

import { ProductoFormComponent } from './producto-form';
import { ProductosService } from '../../../core/services/productos.service';
import { CategoriasService } from '../../../core/services/categorias.service';

describe('ProductoFormComponent', () => {
  let component: ProductoFormComponent;
  let fixture: ComponentFixture<ProductoFormComponent>;
  let router: Router;

  const crearProducto = vi.fn(() => of({}));

  beforeEach(async () => {
    crearProducto.mockClear();

    await TestBed.configureTestingModule({
      imports: [ProductoFormComponent],
      providers: [
        provideRouter([]),
        { provide: ProductosService, useValue: { crearProducto } },
        {
          provide: CategoriasService,
          useValue: {
            getCategorias: () => of([
              { id_categoria: 1, nombre: 'Procesadores', descripcion: null, cantidad_productos: 0 },
            ]),
          },
        },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    vi.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(ProductoFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  const completarFormulario = (valores: object = {}) => {
    component.productoForm.patchValue({
      nombre: 'AMD Ryzen 7 9800X3D',
      codigo: 'CPU-001',
      stock: 15,
      stockAlerta: 10,
      stockCritico: 5,
      idCategoria: 1,
      precio: 450,
      ...valores,
    });
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('carga las categorías desde el servicio', () => {
    expect(component.categorias.length).toBe(1);
  });

  it('el formulario vacío es inválido', () => {
    expect(component.productoForm.invalid).toBe(true);
  });

  it('rechaza un stock crítico mayor o igual al stock de alerta', () => {
    completarFormulario({ stockAlerta: 5, stockCritico: 5 });
    expect(component.productoForm.hasError('criticoMayorOIgual')).toBe(true);

    completarFormulario({ stockAlerta: 10, stockCritico: 5 });
    expect(component.productoForm.valid).toBe(true);
  });

  it('envía el producto al servicio y vuelve al listado', () => {
    completarFormulario();
    component.onSubmit();

    expect(crearProducto).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['/admin/productos']);
  });

  it('no envía nada si el formulario es inválido', () => {
    component.onSubmit();
    expect(crearProducto).not.toHaveBeenCalled();
  });
});
