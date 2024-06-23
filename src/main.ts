import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from '@rha/app.config';
import { AppComponent } from '@rha/app.component';

bootstrapApplication(AppComponent, appConfig)
  .then(() => console.log('%c[Bootstrap] Application has been successfully started! 🚀', 'background-color: darkblue; color: white; font-size: 1rem; padding: .15rem .35rem;'))
  .catch((err) => console.error(err));
