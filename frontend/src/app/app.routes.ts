import { Routes } from '@angular/router';
import { PublicLayout } from './public-layout/public-layout';
import { QuienesSomos } from './quienes-somos/quienes-somos';
import { Landing } from './landing/landing';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout';
import { DashboardComponent } from './features/admin/dashboard/dashboard';
import { CategoriasComponent } from './features/admin/categorias/categorias';
import { ProductosComponent } from './features/admin/productos/productos';
import { ProductoFormComponent } from './features/admin/producto-form/producto-form';
import { MovimientosComponent } from './features/admin/movimientos/movimientos';
import { MovimientoFormComponent } from './features/admin/movimiento-form/movimiento-form';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: '',
        redirectTo: 'landing',
        pathMatch: 'full'
      },
      {
        path: 'landing',
        component: Landing
      },
      {
        path: 'quienes-somos',
        component: QuienesSomos,
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categorias', component: CategoriasComponent },
      { path: 'productos', component: ProductosComponent },
      { path: 'crear-producto', component: ProductoFormComponent },
      { path: 'editar-producto/:id', component: ProductoFormComponent },
      { path: 'movimientos', component: MovimientosComponent },
      { path: 'registrar-movimiento', component: MovimientoFormComponent },
    ]
  },
  {
    path: 'dashboard/user',
    loadComponent: () =>
      import('./pages/dashboard-user/dashboard-user')
        .then((module) => module.DashboardUser)
  }
];