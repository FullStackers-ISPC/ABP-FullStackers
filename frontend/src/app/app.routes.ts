import { Routes } from '@angular/router';
import { PublicLayout } from './public-layout/public-layout';
import { QuienesSomos } from './quienes-somos/quienes-somos';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      {
        path: 'quienes-somos',
        component: QuienesSomos,
      },
    ],
  },
];
