import { Routes } from '@angular/router';
import { loginTokenGuard } from './guards/login-token.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: 'sms-list',
        loadComponent: () => import('./pages/sms-list/sms-list.component').then(m => m.SmsListComponent)
      }
    ],
    canActivate: [ loginTokenGuard ]
  }

];
