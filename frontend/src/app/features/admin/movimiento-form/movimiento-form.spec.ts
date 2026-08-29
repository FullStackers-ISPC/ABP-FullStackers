import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovimientoForm } from './movimiento-form';

describe('MovimientoForm', () => {
  let component: MovimientoForm;
  let fixture: ComponentFixture<MovimientoForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovimientoForm],
    }).compileComponents();

    fixture = TestBed.createComponent(MovimientoForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
