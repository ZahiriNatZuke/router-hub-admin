import { Component, computed, inject, signal } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BaseComponent } from '@rha/common/classes';
import { delay, filter, forkJoin, interval, of, tap } from 'rxjs';
import {
  ConnectionState,
  NetworkInfo,
  NetworkMode,
  NetworkSettings,
  ProfileData,
  SimStatus,
  SystemStatus
} from '@rha/common/types';
import { NETWORKS_TYPES } from '@rha/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton, MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Bolt, LucideAngularModule } from 'lucide-angular';
import { LucideIconData } from 'lucide-angular/icons/types';

@Component({
  selector: 'rha-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterOutlet,
    MatButton,
    LucideAngularModule,
    MatIconButton
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseComponent {

  #dialog = inject(MatDialog);

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
  bolt = signal<LucideIconData>(Bolt);

  constructor() {
    super();
    of(true)
      .pipe(
        delay(150),
        tap(() => this.#loadHomeData())
      ).subscribe();
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
    )
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe(() => this.restarting.set(true));
  }

  openChangeNetworkDialog() {
    this.#dialog.open(
      ChangeNetworkDialog,
      { data: { network: this.systemStatus()?.NetworkType } }
    ).afterClosed()
      .pipe(filter(
        (result) => typeof result === 'number')
      ).subscribe((result) => {
      this.linkZone.setNetworkSettings(result)
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe(() => this.#loadHomeData());
    });
  }

}

@Component({
  template: `
      <h2 mat-dialog-title>Change Network</h2>
      <mat-dialog-content>
          <div class="change-network-form">
              <mat-form-field>
                  <mat-label>Select Network</mat-label>
                  <mat-select [formControl]="networkControl">
                      <mat-option [value]="networkMode.Auto">Auto</mat-option>
                      <mat-option [value]="networkMode.Only2G">Only 2G</mat-option>
                      <mat-option [value]="networkMode.Only3G">Only 3G</mat-option>
                      <mat-option [value]="networkMode.Auto3GAnd4G">4G / 3G</mat-option>
                  </mat-select>
              </mat-form-field>
          </div>
      </mat-dialog-content>
      <mat-dialog-actions>
          <button mat-button [mat-dialog-close]="null" color="warn" [autofocus]="false" tabindex="-1">Cancel</button>
          <button mat-button (click)="saveNetwork()" [autofocus]="true" [disabled]="networkControl.invalid">Apply
          </button>
      </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatDialogTitle,
    FormsModule,
    LucideAngularModule,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    MatLabel
  ],
  styles: `
    .change-network-form {
      @apply w-[350px] gap-y-5 p-5 flex justify-center;

      ::ng-deep {
        .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline .mdc-notched-outline__notch {
          border-left-width: 0;
          border-right-width: 0;
        }

        .mat-mdc-form-field-subscript-wrapper.mat-mdc-form-field-bottom-align {
          display: none;
          visibility: hidden;
        }
      }
    }
  `
})
export class ChangeNetworkDialog {

  #data = inject(MAT_DIALOG_DATA);
  #matDialogRef = inject(MatDialogRef<ChangeNetworkDialog>);
  #fb = inject(FormBuilder);
  protected readonly networkMode = NetworkMode;
  networkControl = this.#fb.nonNullable.control(this.network, Validators.required);

  get network() {
    return this.#data.network;
  }

  saveNetwork() {
    this.#matDialogRef.close(this.networkControl.value);
  }
}
