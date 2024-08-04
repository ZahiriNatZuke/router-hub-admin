import { Routes } from '@angular/router';
import { loginTokenGuard } from '@rha/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./views/login').then(c => c.LoginComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('@rha/views/admin').then(c => c.AdminComponent),
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },
      {
        path: 'home',
        loadComponent: () => import('./views/home').then(c => c.HomeComponent)
      },
      {
        path: 'sms-list',
        loadComponent: () => import('./views/sms-list').then(c => c.SmsListComponent)
      },
      {
        path: 'ussd-codes',
        loadComponent: () => import('./views/ussd-codes').then(c => c.UssdCodesComponent)
      },
      {
        path: 'device-access',
        loadComponent: () => import('./views/device-access').then(c => c.DeviceAccessComponent)
      }
    ],
    canActivate: [ loginTokenGuard ]
  }
];
