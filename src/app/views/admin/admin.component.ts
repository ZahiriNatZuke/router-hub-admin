import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, SidebarComponent } from '@rha/components';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseComponent } from '@rha/common/classes';

@Component({
  selector: 'rha-admin',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    SidebarComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent extends BaseComponent {

  constructor() {
    super();
    interval(5 * 1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.linkZone.heartBeat()
          .subscribe((res) => {
            console.log('[heartBeat]', res?.result ? '✅' : '❌');
          });
      });
  }

}
