import { provideAnimations } from '@angular/platform-browser/animations';
import { TUI_SANITIZER, TuiAlertModule, TuiDialogModule, TuiRootModule } from '@taiga-ui/core';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { NgDompurifySanitizer } from '@tinkoff/ng-dompurify';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideHttpClient(
      withFetch(),
      withInterceptors([ errorInterceptor ])
    ),
    provideRouter(
      routes,
      withComponentInputBinding()
    ),
    importProvidersFrom(
      TuiRootModule,
      TuiDialogModule,
      TuiAlertModule
    ),
    { provide: TUI_SANITIZER, useClass: NgDompurifySanitizer }
  ]
};
