import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LinkZoneService } from '@rha/services';

export const loginTokenGuard: CanActivateFn = () => {
  if ( inject(LinkZoneService).isLoggin() ) {
    return true;
  } else {
    inject(Router).navigate([ '/login' ]);
    return false;
  }
};
