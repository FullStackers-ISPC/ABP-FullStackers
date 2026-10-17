import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpErrorResponse, provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Subject, of, throwError } from 'rxjs';
import { Movimiento } from '../../core/models/movimiento.model';
import { Producto } from '../../core/models/producto.model';
import { MovimientosService } from '../../core/services/movimientos.service';
import { ProductosService } from '../../core/services/productos.service';
import { DashboardUser } from './dashboard-user';

describe('Dashboard de Usuario', () => {
  let fixture: ComponentFixture<DashboardUser>;
  let component: DashboardUser;
  let productsResponse: Subject<Producto[]>;
  let movementsResponse: Subject<Movimiento[]>;
  let crearMovimiento: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    localStorage.removeItem('usuario_actual');
    localStorage.setItem('usuario_actual', JSON.stringify({
      id_usuario: 2, nombre: 'Usuario', apellido: 'Demo',
      email: 'user@easystock.com', rol: 'usuario'
    }));
    crearMovimiento = vi.fn(() => of({}));
    productsResponse = new Subject<Producto[]>();
    movementsResponse = new Subject<Movimiento[]>();

    await TestBed.configureTestingModule({
      imports: [DashboardUser],
      providers: [
        provideHttpClient(),
        provideRouter([]),
        {
          provide: ProductosService,
          useValue: { getProductos: () => productsResponse.asObservable() }
        },
        {
          provide: MovimientosService,
          useValue: {
            getMovimientos: () => movementsResponse.asObservable(),
            crearMovimiento
          }
        }
      ]
    }).compileComponents();

    createComponent();
  });

  afterEach(() => {
    localStorage.removeItem('usuario_actual');
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(DashboardUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  function sampleProducts(): Producto[] {
    return [
      { id: 1, codigo: 'PR-001', nombre: 'Producto disponible', categoria: 'Periféricos', idCategoria: 1, stock: 8, stockAlerta: 3, stockCritico: 1, precio: 10 },
      { id: 2, codigo: 'PR-002', nombre: 'Producto con poco stock', categoria: 'Periféricos', idCategoria: 1, stock: 2, stockAlerta: 3, stockCritico: 1, precio: 5 }
    ];
  }

  function sampleMovements(): Movimiento[] {
    return [{
      id: 1,
      fecha: new Date().toISOString(),
      producto: 'Producto disponible',
      categoria: 'Periféricos',
      tipo: 'entrada',
      cantidad: 2,
      usuario: '2'
    }];
  }

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar la identidad guardada en la sesión', () => {
    localStorage.setItem('usuario_actual', JSON.stringify({
      id_usuario: 2,
      nombre: 'Usuario',
      apellido: 'Demo',
      email: 'user@easystock.com',
      rol: 'usuario'
    }));
    fixture.destroy();
    createComponent();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('.user-name')?.textContent?.trim()).toBe('Usuario Demo');
    expect(page.querySelector('.user-email')?.textContent?.trim()).toBe('user@easystock.com');
    expect(page.querySelector('.topbar-role')?.textContent?.trim()).toBe('Usuario');
  });

  it('debería mostrar valores de respaldo si no hay sesión', () => {
    localStorage.removeItem('usuario_actual');
    fixture.destroy();
    createComponent();
    const page = fixture.nativeElement as HTMLElement;

    expect(page.querySelector('.user-name')?.textContent?.trim()).toBe('Usuario');
    expect(page.querySelector('.user-email')?.textContent?.trim()).toBe('Sin sesión iniciada');
    expect(page.querySelector('.topbar-role')?.textContent?.trim()).toBe('Usuario');
  });

  it('debería mostrar la carga mientras se obtienen productos y movimientos', () => {
    const pageText = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(component.isLoadingProducts).toBe(true);
    expect(component.isLoadingMovements).toBe(true);
    expect(pageText).toContain('Cargando categorías');
    expect(pageText).toContain('Cargando productos');
    expect(pageText).toContain('Cargando movimientos');
  });

  it('debería mostrar productos, movimientos, categorías y métricas al completar la carga', () => {
    productsResponse.next(sampleProducts());
    movementsResponse.next(sampleMovements());
    fixture.detectChanges();

    const pageText = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(component.isLoadingProducts).toBe(false);
    expect(component.isLoadingMovements).toBe(false);
    expect(pageText).toContain('Producto disponible');
    expect(pageText).toContain('Periféricos');
    expect(pageText).not.toContain('Cargando');
    expect(component.getAvailableProductsCount()).toBe(2);
    expect(component.getLowStockCount()).toBe(1);
    expect(component.getTodayMovementsCount()).toBe(1);
  });

  it('debería mostrar un error de productos y categorías en vez de resultados vacíos', () => {
    productsResponse.error(new Error('Productos no disponibles'));
    movementsResponse.next([]);
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    expect(component.isLoadingProducts).toBe(false);
    expect(page.querySelectorAll('[role="alert"]')[0]?.textContent)
      .toContain('No se pudieron cargar los productos y categorías');
    expect(page.textContent).not.toContain('No hay productos registrados en el sistema');
    expect(page.textContent).not.toContain('No hay categorías disponibles');
  });

  it('debería mostrar un error si falla la carga del historial', () => {
    productsResponse.next(sampleProducts());
    movementsResponse.error(new Error('Movimientos no disponibles'));
    fixture.detectChanges();

    const page = fixture.nativeElement as HTMLElement;
    expect(component.isLoadingMovements).toBe(false);
    expect(page.querySelectorAll('[role="alert"]')[0]?.textContent)
      .toContain('No se pudo cargar el historial de movimientos');
    expect(page.textContent).not.toContain('Todavía no hay movimientos registrados');
  });

  it('debería conservar el estado vacío tras una respuesta exitosa sin datos', () => {
    productsResponse.next([]);
    movementsResponse.next([]);
    fixture.detectChanges();

    const pageText = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(component.isLoadingProducts).toBe(false);
    expect(component.isLoadingMovements).toBe(false);
    expect(pageText).toContain('No hay categorías disponibles');
    expect(pageText).toContain('No hay productos registrados en el sistema');
    expect(pageText).toContain('Todavía no hay movimientos registrados');
  });

  it('debería mostrar y contar únicamente los movimientos del usuario actual', () => {
    const propio = sampleMovements()[0];
    movementsResponse.next([propio, { ...propio, id: 2, usuario: '8' }]);
    expect(component.movementHistory).toEqual([propio]);
    expect(component.getTodayMovementsCount()).toBe(1);
  });

  it('debería ocultar movimientos si no hay sesión', () => {
    localStorage.removeItem('usuario_actual');
    fixture.destroy();
    createComponent();
    movementsResponse.next(sampleMovements());
    expect(component.movementHistory).toEqual([]);
  });

  it('debería filtrar productos y limpiar la selección al cambiar categoría', () => {
    productsResponse.next(sampleProducts());
    component.movementForm.patchValue({ category: 'Periféricos', product: 1 });
    expect(component.productosDeCategoria.length).toBe(2);
    component.movementForm.patchValue({ category: 'Otra' });
    component.cambiarCategoria();
    expect(component.productosDeCategoria).toEqual([]);
    expect(component.movementForm.get('product')?.value).toBe('');
  });

  function prepararMovimiento(): void {
    productsResponse.next(sampleProducts());
    component.movementForm.setValue({
      type: 'entrada', category: 'Periféricos', product: 1,
      quantity: 2, observation: ''
    });
  }

  it('debería enviar los IDs y recargar datos después de registrar', () => {
    prepararMovimiento();
    component.onSubmit();
    expect(crearMovimiento).toHaveBeenCalledWith({
      tipo: 'entrada', cantidad: 2, producto: 1, usuario: 2
    });
    expect(component.movementRegistered).toBe(true);
    expect(component.isLoadingProducts).toBe(true);
    expect(component.isLoadingMovements).toBe(true);
  });

  it('debería rechazar un producto de otra categoría sin enviar el POST', () => {
    prepararMovimiento();
    component.movementForm.patchValue({ category: 'Otra' });
    component.onSubmit();
    expect(crearMovimiento).not.toHaveBeenCalled();
    expect(component.mensajeError).toContain('categoría elegida');
  });

  it('debería mostrar el detalle del backend al rechazar un movimiento', () => {
    prepararMovimiento();
    crearMovimiento.mockImplementation(() => throwError(() => new HttpErrorResponse({
      status: 400, error: { cantidad: ['Stock insuficiente. Stock actual: 1'] }
    })));
    component.onSubmit();
    expect(component.mensajeError).toContain('Stock insuficiente. Stock actual: 1');
    expect(component.isSubmitting).toBe(false);
  });
});
