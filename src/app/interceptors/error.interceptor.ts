import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { TuiAlertService } from '@taiga-ui/core';
import { LinkZoneService } from '@rha/services';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const alert = inject(TuiAlertService);
  const linkZone = inject(LinkZoneService);

  return next(req).pipe(
    tap((response) => {
      if ( response instanceof HttpResponse && response.body?.hasOwnProperty('error') ) {
        console.log('[error] >', response.body);
        const error: any = ( response.body as any ).error;
        alert.open(
          error.message,
          { label: 'Router Warning', status: 'warning', autoClose: true }
        ).subscribe();
        if ( linkZone.isLoggin ) {
          linkZone.logout();
          router.navigate([ '/login' ], { queryParams: { returnUrl: router.url } });
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.log('[error] >', error.error);
      alert.open(
        'Connection lost, check your connection to the device',
        { label: 'Router Warning', status: 'warning', autoClose: true, }
      ).subscribe();
      if ( linkZone.isLoggin ) {
        linkZone.logout();
        router.navigate([ '/login' ], { queryParams: { returnUrl: router.url } });
      }
      return of();
    })
  );
};
