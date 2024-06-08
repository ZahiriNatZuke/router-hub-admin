import { Component, inject, signal } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NETWORKS_TYPES } from '@rha/common';
import { LucideAngularModule, Signal, SignalHigh, SignalLow, SignalMedium, SignalZero } from 'lucide-angular';
import { LucideIconData } from 'lucide-angular/icons/types';
import { Router } from '@angular/router';
import { BaseComponent } from '@rha/common/classes';
import { SystemStatus } from '@rha/common/types';

@Component({
  selector: 'rha-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass,
    LucideAngularModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends BaseComponent {

  #router = inject(Router);

  isOnline = signal(false);
  networkName = signal('');
  networkType = signal('');
  signalStrength = signal<LucideIconData | null>(null);

  readonly #signalIcons: LucideIconData[] = [
    SignalZero,
    SignalLow,
    SignalMedium,
    SignalHigh,
    Signal
  ];

  constructor() {
    super();
    this.#getSystemStatus();
    interval(3 * 1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.#getSystemStatus());
  }

  #getSystemStatus() {
    this.linkZone.getSystemStatus().subscribe((response) => {
      if ( response.result ) {
        const result: SystemStatus = response.result;
        this.isOnline.set(result.ConnectionStatus === 2);
        this.networkName.set(result.NetworkName);
        this.networkType.set(NETWORKS_TYPES[ result.NetworkType ]);
        this.signalStrength.set(this.#signalIcons[ result.SignalStrength - 1 ]);
      }
    });
  }

  get isLoggin() {
    return this.linkZone.isLoggin;
  }

  logOut() {
    this.linkZone.logout();
    this.#router.navigate([ '/login' ]);
  }

}
