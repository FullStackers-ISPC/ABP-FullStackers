import { Component, inject } from '@angular/core';
import {
  Router,
  NavigationEnd,
  RouterOutlet,
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { filter } from 'rxjs/operators';
import { LoginResponse } from '../../core/models/usuario.model';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TitleCasePipe
  ],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css'
})
export class AdminLayoutComponent {

  private router = inject(Router);
  private authService = inject(AuthService);
  private readonly usuarioActual = this.obtenerUsuarioActual();

  readonly nombreUsuario = [this.usuarioActual?.nombre, this.usuarioActual?.apellido]
    .map((parte) => parte?.trim())
    .filter((parte): parte is string => Boolean(parte))
    .join(' ') || 'Administrador';
  readonly emailUsuario = this.usuarioActual?.email?.trim() || 'Sin sesión iniciada';
  readonly rolUsuario = this.getRolUsuario(this.usuarioActual?.rol);

  rutas: string[] = [];

  private obtenerUsuarioActual(): LoginResponse | null {
    try {
      return this.authService.getUsuarioActual();
    } catch {
      return null;
    }
  }

  private getRolUsuario(rol?: string): string {
    const rolNormalizado = rol?.trim().toLowerCase();

    if (rolNormalizado === 'admin') {
      return 'Administrador';
    }

    if (rolNormalizado === 'usuario' || rolNormalizado === 'user') {
      return 'Usuario';
    }

    return 'Administrador';
  }

  constructor() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {

      let segmentos = event.urlAfterRedirects
        .split('/')
        .filter((s: string) => s !== '');

      if (segmentos[0] === 'admin') {
        segmentos.shift();
      }

      this.rutas = segmentos.map(
        (s: string) => s.replace(/-/g, ' ')
      );

      if (this.rutas.length === 0) {
        this.rutas = ['Panel'];
      }

    });

  }

  cerrarSesion(): void {
    this.router.navigate(['/landing']);
  }

}