import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter, Router } from '@angular/router';
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
      id_usuario: 1,
      nombre: 'Administrador',
      apellido: 'EasyStock',
      email: 'admin@easystock.com',
      rol: 'admin'
    }));
    fixture.destroy();
    createComponent();

    const page = fixture.nativeElement as HTMLElement;
    expect(page.querySelector('.user-name')?.textContent?.trim()).toBe('Administrador EasyStock');
    expect(page.querySelector('.user-email')?.textContent?.trim()).toBe('admin@easystock.com');
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

  it('debería borrar la sesión al pulsar Cerrar Sesión', () => {
    const navegar = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    localStorage.setItem('usuario_actual', JSON.stringify({ id_usuario: 1, rol: 'admin' }));
    (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('.btn-logout')!.click();
    expect(localStorage.getItem('usuario_actual')).toBeNull();
    expect(navegar).toHaveBeenCalledWith(['/landing']);
  });
});
