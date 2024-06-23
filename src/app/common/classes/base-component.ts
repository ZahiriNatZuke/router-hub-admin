import { Component, DestroyRef, inject } from '@angular/core';
import { LinkZoneService } from '@rha/services';

@Component({ standalone: true, template: '' })
export class BaseComponent {

  protected linkZone = inject(LinkZoneService);
  protected destroyRef$ = inject(DestroyRef);

}
