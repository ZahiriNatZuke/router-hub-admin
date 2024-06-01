import { Component, inject } from '@angular/core';
import { LinkZoneService } from '@rha/services';

@Component({ standalone: true, template: '' })
export class BaseComponent {

  protected linkZone = inject(LinkZoneService);

}
