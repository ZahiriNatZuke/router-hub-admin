import { Component, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '@rha/components';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseComponent } from '@rha/common/classes';

@Component({
  selector: 'rha-admin',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterOutlet,
    HeaderComponent,
    RouterLinkActive
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent extends BaseComponent {

  sidebar = signal<{ label: string, route: string }[]>([
    { label: 'Home', route: '/admin/home' },
    { label: 'SMS List', route: '/admin/sms-list' },
    { label: 'USSD Codes', route: '/admin/ussd-codes' }
  ]);

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
