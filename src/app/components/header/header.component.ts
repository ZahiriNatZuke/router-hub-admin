import { Component, inject, signal } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { TuiButtonModule, TuiHintModule } from '@taiga-ui/core';
import { LinkZoneService } from '../../services/link-zone.service';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NETWORKS_TYPES } from '../../common';
import { LucideAngularModule, Signal, SignalHigh, SignalLow, SignalMedium, SignalZero } from 'lucide-angular';
import { LucideIconData } from 'lucide-angular/icons/types';
import { Router } from '@angular/router';

@Component({
  selector: 'rha-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    TuiButtonModule,
    TuiHintModule,
    NgClass,
    LucideAngularModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  #linkZone = inject(LinkZoneService);
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
    this.#getSystemStatus();
    interval(10 * 1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.#getSystemStatus());
  }

  #getSystemStatus() {
    this.#linkZone.getSystemStatus().subscribe((respone) => {
      if ( respone.result ) {
        console.log(respone);
        this.isOnline.set(respone.result.ConnectionStatus === 2);
        this.networkName.set(respone.result.NetworkName);
        this.networkType.set(NETWORKS_TYPES[ respone.result.NetworkType ]);
        this.signalStrength.set(this.#signalIcons[ respone.result.SignalStrength - 1 ]);
      }
    });
  }

  get isLoggin() {
    return this.#linkZone.isLoggin;
  }

  logOut() {
    this.#linkZone.disconnect().subscribe(() => {
      this.#router.navigate([ '/login' ]);
    });
  }

}
