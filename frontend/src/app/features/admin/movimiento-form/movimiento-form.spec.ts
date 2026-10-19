import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ProductosService } from '../../../core/services/productos.service';
import { MovimientosService } from '../../../core/services/movimientos.service';
import { AuthService } from '../../../core/services/auth.service';
import { MovimientoFormComponent } from './movimiento-form';

describe('MovimientoForm', () => {
  let component: MovimientoFormComponent;
  let fixture: ComponentFixture<MovimientoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoFormComponent],
      providers: [
        provideRouter([]),
        { provide: ProductosService, useValue: { getProductos: () => of([]) } },
        { provide: MovimientosService, useValue: { crearMovimiento: vi.fn() } },
        { provide: AuthService, useValue: { getUsuarioActual: () => null } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('debería crear el formulario con productos vacíos y campos requeridos', () => {
    expect(component).toBeTruthy();
    expect(component.productos).toEqual([]);
    expect(component.movimientoForm.invalid).toBe(true);
  });
});
