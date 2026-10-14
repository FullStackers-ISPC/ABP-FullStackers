import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { ProductosService } from '../../../core/services/productos.service';
import { DashboardComponent } from './dashboard';

describe('Dashboard', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideRouter([]),
        {
          provide: MovimientosService,
          useValue: {
            getMovimientos: () => of([{
              id: 1,
              fecha: new Date().toLocaleDateString('es-AR'),
              producto: 'Producto de prueba',
              categoria: 'Categoría de prueba',
              tipo: 'entrada',
              cantidad: 2,
              usuario: 'admin'
            }])
          }
        },
        {
          provide: ProductosService,
          useValue: {
            getProductos: () => of([
              { id: 1, nombre: 'Disponible', categoria: 'Prueba', stock: 5, stockAlerta: 2, stockCritico: 1, precio: 1 },
              { id: 2, nombre: 'Stock bajo', categoria: 'Prueba', stock: 1, stockAlerta: 2, stockCritico: 1, precio: 1 }
            ])
          }
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

  it('should calculate summary metrics from service data', () => {
    expect(component.productosDisponibles).toBe(2);
    expect(component.movimientosHoy).toBe(1);
    expect(component.productosStockBajo).toHaveLength(1);
  });
});
