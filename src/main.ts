import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@rha/app.config';
import { AppComponent } from '@rha/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('[Bootstrap] Application has been successfully started! 🚀'))
  .catch((err) => console.error(err));
