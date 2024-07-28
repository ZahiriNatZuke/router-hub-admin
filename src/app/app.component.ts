import { afterNextRender, AfterRenderPhase, Component, inject, PLATFORM_ID } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { isPlatformBrowser, NgOptimizedImage } from '@angular/common';
import { RequestVerificationToken } from '@rha/common';
import { BaseComponent } from '@rha/common/classes';
import { ThemeService } from '@rha/services';
import { BgEffectComponent } from '@rha/components';

@Component({
  selector: 'rha-root',
  standalone: true,
  imports: [
    RouterOutlet,
    NgOptimizedImage,
    RouterLink,
    BgEffectComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent extends BaseComponent {

  #platform = inject(PLATFORM_ID);
  #themeService = inject(ThemeService);

  constructor() {
    super();
    if ( isPlatformBrowser(this.#platform) ) {
      if ( sessionStorage.getItem(RequestVerificationToken) )
        this.linkZone.token = sessionStorage.getItem(RequestVerificationToken)!;

      afterNextRender(
        () => this.#themeService.getColorPreference(),
        { phase: AfterRenderPhase.MixedReadWrite }
      );
    }
  }

}
