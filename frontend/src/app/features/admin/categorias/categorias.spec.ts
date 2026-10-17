import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { of } from 'rxjs';

import { CategoriasComponent } from './categorias';
import { CategoriasService } from '../../../core/services/categorias.service';

describe('CategoriasComponent', () => {
  let component: CategoriasComponent;
  let fixture: ComponentFixture<CategoriasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriasComponent],
      providers: [provideRouter([]), {
        provide: CategoriasService,
        useValue: {
          getCategorias: () => of([]),
          eliminarCategoria: () => of(void 0),
        },
      }],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoriasComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
