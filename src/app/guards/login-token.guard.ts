import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { LinkZoneService } from '../services/link-zone.service';

export const loginTokenGuard: CanActivateFn = () => {
  if ( inject(LinkZoneService).isLoggin ) {
    return true;
  } else {
    inject(Router).navigate([ '/login' ]);
    return false;
  }
};
