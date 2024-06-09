import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { LinkZoneService } from '@rha/services';
import { MatSnackBar } from '@angular/material/snack-bar';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const snackBar = inject(MatSnackBar);
  const linkZone = inject(LinkZoneService);

  return next(req).pipe(
    tap((response) => {
      if ( response instanceof HttpResponse && response.body?.hasOwnProperty('error') ) {
        console.log('[error] >', response.body);
        const error: any = ( response.body as any ).error;
        snackBar.open(
          error.message,
          'Router Warning',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          }
        );
        if ( linkZone.isLoggin() ) {
          linkZone.logout();
          router.navigate([ '/login' ], { queryParams: { returnUrl: router.url } });
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      console.log('[error] >', error.error);
      snackBar.open(
        'Connection lost, check your connection to the device',
        'Router Warning',
        {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        }
      );
      if ( linkZone.isLoggin() ) {
        linkZone.logout();
        router.navigate([ '/login' ], { queryParams: { returnUrl: router.url } });
      }
      return of();
    })
  );
};
