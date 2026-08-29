import { Routes } from '@angular/router';
import { PublicLayout } from './public-layout/public-layout';
import { QuienesSomos } from './quienes-somos/quienes-somos';
import { Landing } from './landing/landing';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { 
        path: '', 
        redirectTo: 'landing', 
        pathMatch: 'full' },
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
];
