import { provideAnimations } from '@angular/platform-browser/animations';
import { TUI_SANITIZER, TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(
      withFetch()
    ),
    provideRouter(routes),
    importProvidersFrom(
      TuiRootModule,
      TuiDialogModule,
      TuiAlertModule
    ),
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }
  ]
};
