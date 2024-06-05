import { Component, computed, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BaseComponent } from '@rha/common/classes';
import { forkJoin, interval } from 'rxjs';
import { ConnectionState, NetworkInfo, NetworkSettings, ProfileData, SimStatus, SystemStatus } from '@rha/common/types';
import { NETWORKS_TYPES } from '@rha/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'rha-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterOutlet,
    MatButton
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponent {

  systemStatus = signal<SystemStatus | null>(null);
  networkInfo = signal<NetworkInfo | null>(null);
  networkSettings = signal<NetworkSettings | null>(null);
  connectionState = signal<ConnectionState | null>(null);
  simStatus = signal<SimStatus | null>(null);
  currentProfile = signal<ProfileData | null>(null);
  buttonLabel = computed(
    () => this.connectionState()?.ConnectionStatus === 2 ? 'Disconnect' : 'Connect'
  );
  internetStatusLabel = computed(
    () =>
      this.restarting()
        ? 'Restarting...'
        : this.connectionState()?.ConnectionStatus === 2 ? 'Connected' : 'Disconnected'
  );
  simStatusLabel = computed(
    () => this.simStatus()?.PinState === 2 ? 'Ready' : 'Not Ready'
  );
  restarting = signal<boolean>(false);
  networkType = computed(
    () => this.systemStatus()?.NetworkType ? NETWORKS_TYPES[ this.systemStatus()!.NetworkType ] : ''
  );

  constructor() {
    super();
    this.#loadHomeData();
    interval(3 * 1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.#loadHomeData());
  }

  #loadHomeData() {
    forkJoin({
      systemStatus: this.linkZone.getSystemStatus(),
      networkInfo: this.linkZone.getNetworkInfo(),
      networkSettings: this.linkZone.getNetworkSettings(),
      connectionState: this.linkZone.getConnectionState(),
      simStatus: this.linkZone.getSimStatus(),
      currentProfile: this.linkZone.getCurrentProfile()
    }).subscribe((res) => {
      this.systemStatus.set(res.systemStatus.result);
      this.networkInfo.set(res.networkInfo.result);
      this.networkSettings.set(res.networkSettings.result);
      this.connectionState.set(res.connectionState.result);
      this.simStatus.set(res.simStatus.result);
      this.currentProfile.set(res.currentProfile.result);
      this.restarting.set(this.connectionState()?.ConnectionStatus === 3);
    });
  }

  toggleConnection() {
    (
      this.connectionState()?.ConnectionStatus === 2
        ? this.linkZone.disconnectInternet()
        : this.linkZone.connectInternet()
    ).subscribe(() => this.restarting.set(true));
  }
}
