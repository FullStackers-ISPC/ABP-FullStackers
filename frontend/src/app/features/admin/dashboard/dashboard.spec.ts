import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Subject } from 'rxjs';
import { DashboardData, DashboardService } from '../../../core/services/dashboard.service';
import { DashboardComponent } from './dashboard';

describe('Dashboard', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let dashboardResponse: Subject<DashboardData>;

  beforeEach(async () => {
    dashboardResponse = new Subject<DashboardData>();

    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: DashboardService,
          useValue: { getDashboardData: () => dashboardResponse.asObservable() }
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar el estado de carga mientras se obtienen los datos del dashboard', () => {
    expect(component.isLoadingDashboard).toBe(true);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Cargando los datos del panel');
  });

  it('debería mostrar las métricas y los listados tras una respuesta exitosa', () => {
    dashboardResponse.next({
      availableProducts: 2,
      movementsToday: 1,
      lowStockProducts: [
        { id: 2, codigo: 'PR-002', nombre: 'Stock bajo', categoria: 'Prueba', idCategoria: 1, stock: 1, stockAlerta: 2, stockCritico: 1, precio: 1 }
      ],
      movements: [{
        id: 1,
        fecha: new Date().toLocaleDateString('es-AR'),
        producto: 'Producto de prueba',
        categoria: 'Categoría de prueba',
        tipo: 'entrada',
        cantidad: 2,
        usuario: 'admin'
      }]
    });
    fixture.detectChanges();

    expect(component.isLoadingDashboard).toBe(false);
    expect(component.productosDisponibles).toBe(2);
    expect(component.movimientosHoy).toBe(1);
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Producto de prueba');
  });

  it('debería mostrar un error en vez de estados vacíos si falla la carga', () => {
    dashboardResponse.error(new Error('API no disponible'));
    fixture.detectChanges();

    expect(component.isLoadingDashboard).toBe(false);
    expect((fixture.nativeElement as HTMLElement).querySelector('[role="alert"]')?.textContent)
      .toContain('No se pudieron cargar los datos del panel');
    expect((fixture.nativeElement as HTMLElement).textContent)
      .not.toContain('Todavía no hay movimientos registrados');
  });

  it('debería conservar los estados vacios tras una respuesta exitosa sin registros', () => {
    dashboardResponse.next({
      availableProducts: 0,
      movementsToday: 0,
      lowStockProducts: [],
      movements: []
    });
    fixture.detectChanges();

    const pageText = (fixture.nativeElement as HTMLElement).textContent ?? '';
    expect(component.isLoadingDashboard).toBe(false);
    expect(pageText).toContain('Todavía no hay movimientos registrados en el sistema.');
    expect(pageText).toContain('No hay productos con stock bajo en este momento.');
  });

  it('should calculate summary metrics from service data', () => {
    dashboardResponse.next({
      availableProducts: 2,
      movementsToday: 1,
      lowStockProducts: [
        { id: 2, codigo: 'PR-002', nombre: 'Stock bajo', categoria: 'Prueba', idCategoria: 1, stock: 1, stockAlerta: 2, stockCritico: 1, precio: 1 }
      ],
      movements: []
    });

    expect(component.productosDisponibles).toBe(2);
    expect(component.movimientosHoy).toBe(1);
    expect(component.productosStockBajo).toHaveLength(1);
  });
});
