import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject, of } from 'rxjs';
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

  beforeEach(async () => {
    productsResponse = new Subject<Producto[]>();
    movementsResponse = new Subject<Movimiento[]>();

    await TestBed.configureTestingModule({
      imports: [DashboardUser],
      providers: [
        provideRouter([]),
        {
          provide: ProductosService,
          useValue: { getProductos: () => productsResponse.asObservable() }
        },
        {
          provide: MovimientosService,
          useValue: {
            getMovimientos: () => movementsResponse.asObservable(),
            crearMovimiento: () => of({} as Movimiento)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  function sampleProducts(): Producto[] {
    return [
      { id: 1, nombre: 'Producto disponible', categoria: 'Periféricos', stock: 8, stockAlerta: 3, stockCritico: 1, precio: 10 },
      { id: 2, nombre: 'Producto con poco stock', categoria: 'Periféricos', stock: 2, stockAlerta: 3, stockCritico: 1, precio: 5 }
    ];
  }

  function sampleMovements(): Movimiento[] {
    return [{
      id: 1,
      fecha: new Date().toLocaleDateString('es-AR'),
      producto: 'Producto disponible',
      categoria: 'Periféricos',
      tipo: 'entrada',
      cantidad: 2,
      usuario: 'usuario'
    }];
  }

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
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
});