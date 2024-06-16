import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { NgClass, NgOptimizedImage } from '@angular/common';
import { forkJoin, interval, Subject, takeUntil } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NETWORKS_TYPES } from '@rha/common';
import {
  LogOut,
  LucideAngularModule,
  Signal,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SignalZero,
  WifiOff
} from 'lucide-angular';
import { LucideIconData } from 'lucide-angular/icons/types';
import { Router } from '@angular/router';
import { BaseComponent } from '@rha/common/classes';
import { SystemStatus } from '@rha/common/types';
import { MatIconButton } from '@angular/material/button';
import { MatSlideToggle, MatSlideToggleChange } from '@angular/material/slide-toggle';
import { NetworkMode } from '@rha/common/types/enums';
import { ThemeToggleComponent } from '@rha/components';

@Component({
  selector: 'rha-header',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgClass,
    LucideAngularModule,
    MatIconButton,
    MatSlideToggle,
    ThemeToggleComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends BaseComponent {

  #router = inject(Router);
  #signalIcons = signal<LucideIconData[]>([
    SignalZero,
    SignalLow,
    SignalMedium,
    SignalHigh,
    Signal
  ]).asReadonly();
  #clearInterval$ = new Subject<boolean>();
  #destroyRef$ = inject(DestroyRef);

  isOnline = signal(false);
  networkName = signal('');
  networkType = signal('');
  signalStrength = signal<LucideIconData>(WifiOff);
  logOutIcon = signal<LucideIconData>(LogOut).asReadonly();
  isLoggin = this.linkZone.isLoggin;
  is4GOnly = signal(false);

  constructor() {
    super();
    effect(() => {
      this.#clearInterval$.next(true);
      this.isLoggin()
        ? this.#executeInterval(() => this.#getSystemStatusAndNetwirkSettings())
        : this.#executeInterval(() => this.#getSystemStatus());
    });
  }

  #getSystemStatus() {
    this.linkZone.getSystemStatus()
      .subscribe((response) => {
        if ( response.result )
          this.#setSysStatusParams(response.result);
      });
  }

  #getSystemStatusAndNetwirkSettings() {
    forkJoin({
      sysStatus: this.linkZone.getSystemStatus(),
      networkSettings: this.linkZone.getNetworkSettings()
    }).subscribe(({ sysStatus, networkSettings }) => {
      if ( sysStatus.result )
        this.#setSysStatusParams(sysStatus.result);

      if ( networkSettings.result ) {
        this.is4GOnly.set(networkSettings.result.NetworkMode === NetworkMode.Only4G);
      }
    });
  }

  #setSysStatusParams(result: SystemStatus) {
    this.isOnline.set(result.ConnectionStatus === 2);
    this.networkName.set(result.NetworkName);
    this.networkType.set(NETWORKS_TYPES[ result.NetworkType ]);
    this.signalStrength.set(this.#signalIcons()[ result.SignalStrength - 1 ]);
  }

  #executeInterval(func: Function) {
    func();
    interval(3 * 1000)
      .pipe(
        takeUntilDestroyed(this.#destroyRef$),
        takeUntil(this.#clearInterval$)
      )
      .subscribe(() => func());
  }

  onlogOut() {
    this.linkZone.logout();
    this.#router.navigate([ '/login' ]);
  }

  toggle4GOnly($event: MatSlideToggleChange) {
    $event.checked
      ? this.linkZone.setNetworkSettings(NetworkMode.Only4G).subscribe()
      : this.linkZone.setNetworkSettings(NetworkMode.Auto3GAnd4G).subscribe();
  }
}
