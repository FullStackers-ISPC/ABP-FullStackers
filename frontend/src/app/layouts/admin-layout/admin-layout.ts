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

  rutas: string[] = [];

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