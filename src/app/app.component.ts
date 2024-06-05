import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgOptimizedImage } from '@angular/common';
import { LinkZoneService } from '@rha/services';
import { RequestVerificationToken } from '@rha/common';

@Component({
  selector: 'rha-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent {

  #linkZone = inject(LinkZoneService);

  constructor() {
    if ( sessionStorage.getItem(RequestVerificationToken) ) {
      this.#linkZone.token = sessionStorage.getItem(RequestVerificationToken)!;
    }
  }

}
