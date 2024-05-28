import { Component, inject } from '@angular/core';
import { LinkZoneService } from '../../services/link-zone.service';

@Component({ standalone: true, template: '' })
export class BaseComponent {

  protected linkZone = inject(LinkZoneService);

}
