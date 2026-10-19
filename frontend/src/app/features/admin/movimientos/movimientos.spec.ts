import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { MovimientosService } from '../../../core/services/movimientos.service';

import { MovimientosComponent } from './movimientos';

describe('Movimientos', () => {
  let component: MovimientosComponent;
  let fixture: ComponentFixture<MovimientosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientosComponent],
      providers: [
        provideRouter([]),
        { provide: MovimientosService, useValue: { getMovimientos: () => of([]) } }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovimientosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('debería crear el listado con un historial vacío', () => {
    expect(component).toBeTruthy();
    expect(component.movimientos).toEqual([]);
  });
});
