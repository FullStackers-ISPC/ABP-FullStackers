import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout';

describe('AdminLayout', () => {
  let component: AdminLayoutComponent;
  let fixture: ComponentFixture<AdminLayoutComponent>;

  beforeEach(async () => {
    localStorage.removeItem('usuario_actual');

    await TestBed.configureTestingModule({
      imports: [AdminLayoutComponent],
      providers: [provideHttpClient(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  afterEach(() => {
    localStorage.removeItem('usuario_actual');
  });

  function createComponent(): void {
    fixture = TestBed.createComponent(AdminLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar la identidad de la sesión administrativa', () => {
    localStorage.setItem('usuario_actual', JSON.stringify({
      id_usuario: 3,
      nombre: 'Fausto',
      apellido: 'Fili',
      email: 'fausto@example.com',
      rol: 'admin'
    }));
    fixture.destroy();
    createComponent();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('.user-name')?.textContent?.trim()).toBe('Fausto Fili');
    expect(page.querySelector('.user-email')?.textContent?.trim()).toBe('fausto@example.com');
    expect(page.querySelector('.topbar-role')?.textContent?.trim()).toBe('Administrador');
  });

  it('debería mostrar valores de respaldo cuando no hay sesión', () => {
    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('.user-name')?.textContent?.trim()).toBe('Administrador');
    expect(page.querySelector('.user-email')?.textContent?.trim()).toBe('Sin sesión iniciada');
    expect(page.querySelector('.topbar-role')?.textContent?.trim()).toBe('Administrador');
  });

  it('debería mostrar valores de respaldo si la sesión guardada no es válida', () => {
    localStorage.setItem('usuario_actual', '{sesion-invalida');
    fixture.destroy();
    createComponent();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('.user-name')?.textContent?.trim()).toBe('Administrador');
    expect(page.querySelector('.user-email')?.textContent?.trim()).toBe('Sin sesión iniciada');
    expect(page.querySelector('.topbar-role')?.textContent?.trim()).toBe('Administrador');
  });
});
