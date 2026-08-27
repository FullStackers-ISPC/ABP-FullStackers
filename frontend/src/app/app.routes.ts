import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: 'dashboard/user',
		loadComponent: () => import('./pages/dashboard-user/dashboard-user').then((module) => module.DashboardUser)
	}
];
