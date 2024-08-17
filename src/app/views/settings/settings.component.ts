import { Component, computed, inject, signal } from '@angular/core';
import { CounterComponent } from '@rha/components';
import { Eye, EyeOff, LucideAngularModule } from 'lucide-angular';
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from '@angular/material/tabs';
import { BaseComponent } from '@rha/common/classes';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WlanSettings } from '@rha/common/types';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'rha-settings',
  standalone: true,
  imports: [
    CounterComponent,
    LucideAngularModule,
    MatTabGroup,
    MatTab,
    MatTabLabel,
    MatTabContent,
    MatFormField,
    MatInput,
    MatLabel,
    ReactiveFormsModule,
    MatButton,
    MatIconButton,
    MatSuffix,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent extends BaseComponent {

  #fb = inject(FormBuilder);
  #router = inject(Router);

  wlanSettings = signal<WlanSettings>({} as any);
  hide = signal(true);
  inputType = computed(() => this.hide() ? 'password' : 'text');
  suffixIcon = computed(() => this.hide() ? EyeOff : Eye);

  wlanFormGroup = this.#fb.nonNullable.group({
    Ssid: this.#fb.nonNullable.control('', Validators.required),
    WpaKey: this.#fb.nonNullable.control('', Validators.required),
  });

  changePasswordGroup = this.#fb.nonNullable.group({
    CurrPassword: this.#fb.nonNullable.control('', [ Validators.required, Validators.minLength(8) ]),
    NewPassword: this.#fb.nonNullable.control('', [ Validators.required, Validators.minLength(8) ]),
  });

  constructor() {
    super();
    this.#fetchWlanSettings();
  }

  #fetchWlanSettings() {
    this.linkZone.getWlanSettings()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((res) => {
        this.wlanSettings.set(res.result);
        this.wlanFormGroup.reset({
          Ssid: this.wlanSettings().AP2G.Ssid,
          WpaKey: this.wlanSettings().AP2G.WpaKey
        });
      });
  }

  toggleHide(event: MouseEvent) {
    event.stopPropagation();
    this.hide.set(!this.hide());
  }

  applyWlanSettings() {
    if ( this.wlanFormGroup.valid ) {
      this.linkZone.setWlanSettings({
        show2GPassword: 0,
        show5GPassword: false,
        showAP2G_guestPassword: false,
        WiFiOffTime: 0,
        AP2G: {
          ...this.wlanSettings().AP2G,
          ...this.wlanFormGroup.value
        },
        AP2G_guest: {
          ApStatus: 0,
          WMode: 3,
          CountryCode: 'CN',
          Ssid: '',
          SsidHidden: 0,
          Channel: 0,
          SecurityMode: 3,
          WepType: 0,
          WepKey: this.wlanFormGroup.value.WpaKey,
          WpaType: 1,
          WpaKey: this.wlanFormGroup.value.WpaKey,
          ApIsolation: 0,
          max_numsta: 15,
          curr_num: 0,
          CurChannel: 8,
          Bandwidth: 0
        },
        AP5G: {
          WlanAPID: 1,
          ApStatus: 0,
          WMode: 4,
          Ssid: '',
          SsidHidden: 0,
          Channel: 0,
          SecurityMode: 4,
          WepType: 1,
          WepKey: this.wlanFormGroup.value.WpaKey,
          WpaType: 1,
          WpaKey: this.wlanFormGroup.value.WpaKey,
          CountryCode: 'CN',
          ApIsolation: 0,
          max_numsta: 15,
          curr_num: 0,
          Bandwidth: 0
        }
      })
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe((res) => {
          if ( res.error === undefined ) {
            this.linkZone.logout();
            this.#router.navigate([ '/login' ]);
          }
        });
    }
  }

  applyChangePassword() {
    if ( this.changePasswordGroup.valid ) {
      const { CurrPassword, NewPassword } = this.changePasswordGroup.value;
      this.linkZone.changePassword(CurrPassword!, NewPassword!)
        .pipe(takeUntilDestroyed(this.destroyRef$))
        .subscribe((res) => {
          if ( res.error === undefined ) {
            this.linkZone.logout();
            this.#router.navigate([ '/login' ]);
          }
        });
    }
  }
}
