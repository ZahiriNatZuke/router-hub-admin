import { Component, inject, signal } from '@angular/core';
import { BaseComponent } from "@rha/common/classes";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { Device } from "@rha/common/types";
import { MatTab, MatTabContent, MatTabGroup, MatTabLabel } from "@angular/material/tabs";
import { MatCell, MatCellDef, MatColumnDef, MatHeaderCell, MatHeaderCellDef, MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef, MatTable } from "@angular/material/table";
import { MatSort, MatSortHeader } from "@angular/material/sort";
import { MatSlideToggle, MatSlideToggleChange } from "@angular/material/slide-toggle";
import { MatButton, MatButtonModule, MatIconButton } from "@angular/material/button";
import { DatePipe } from "@angular/common";
import { CounterComponent } from "@rha/components";
import { LucideAngularModule, Pencil } from "lucide-angular";
import { LucideIconData } from "lucide-angular/icons/types";
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from "@angular/material/dialog";
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormField, MatLabel, MatSuffix } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { filter, interval } from "rxjs";

@Component({
  selector: 'rha-device-access',
  standalone: true,
  imports: [
    MatTab,
    MatTabGroup,
    MatTabLabel,
    MatTabContent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatHeaderCellDef,
    MatSlideToggle,
    MatButton,
    DatePipe,
    CounterComponent,
    LucideAngularModule,
    MatIconButton
  ],
  templateUrl: './device-access.component.html',
  styleUrl: './device-access.component.scss'
})
export class DeviceAccessComponent extends BaseComponent {

  #dialog = inject(MatDialog);

  devicesConnectedList = signal<Device[]>([]);
  devicesBlockedList = signal<Device[]>([]);
  connectedColumns = signal<string[]>([
    'DeviceName',
    'IPAddress',
    'AssociationTime',
    'InternetRight',
    'Operation'
  ]);
  blockedColumns = signal<string[]>([
    'DeviceName',
    'MacAddress',
    'Operation'
  ]);
  PencilIcon = signal<LucideIconData>(Pencil).asReadonly();

  constructor() {
    super();
    this.#fetchConnectedDevicesList();
    this.#fetchBlockedDevicesList();
    interval(1000 * 3)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.#fetchConnectedDevicesList();
        this.#fetchBlockedDevicesList();
      });
  }

  #fetchConnectedDevicesList() {
    this.linkZone.getConnectedDeviceList()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((res) => {
        this.devicesConnectedList.set(res.result.ConnectedList);
      })
  }

  #fetchBlockedDevicesList() {
    this.linkZone.getBlockedDeviceList()
      .pipe(takeUntilDestroyed(this.destroyRef$))
      .subscribe((res) => {
        this.devicesBlockedList.set(res.result.BlockList);
      })
  }

  toggleInternetAccess($event: MatSlideToggleChange, device: Device) {
    device.InternetRight = $event.checked ? 1 : 0;
    this.linkZone.setInternetRight(device).subscribe();
  }

  openChangeDeviceNameDialog(device: Device) {
    this.#dialog.open(
      ChangeDeviceNameDialog,
      { data: { name: device.DeviceName } }
    ).afterClosed()
      .pipe(filter(Boolean))
      .subscribe((result) => {
        this.linkZone.setDeviceName({ ...device, DeviceName: result })
          .subscribe(() => this.#fetchConnectedDevicesList());
      });
  }

  blockDevice(device: Device) {
    this.#dialog.open(
      ConfirmationDeviceActionDialog,
      { data: { name: device.DeviceName, action: 'block' } }
    ).afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.linkZone.setConnectedDeviceBlock(device)
          .subscribe(() => {
            this.#fetchConnectedDevicesList();
            this.#fetchBlockedDevicesList();
          });
      });
  }

  unBlockDevice(device: Device) {
    this.#dialog.open(
      ConfirmationDeviceActionDialog,
      { data: { name: device.DeviceName, action: 'unblock' } }
    ).afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.linkZone.setDeviceUnblock(device)
          .subscribe(() => {
            this.#fetchBlockedDevicesList();
            this.#fetchConnectedDevicesList();
          });
      });
  }

}

@Component({
  template: `
      <h2 mat-dialog-title>Edit Device Name</h2>
      <mat-dialog-content>
          <div class="change-device-name-form">
              <mat-form-field class="w-full">
                  <mat-label>Device Name</mat-label>
                  <input matInput [formControl]="deviceNameControl" type="text">
              </mat-form-field>
          </div>
      </mat-dialog-content>
      <mat-dialog-actions>
          <button mat-button [mat-dialog-close]="false" color="warn" [autofocus]="false" tabindex="-1">Cancel</button>
          <button mat-button (click)="saveDeviceName()" [autofocus]="true" [disabled]="deviceNameControl.invalid">Apply</button>
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
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule
  ],
  styles: `
    .change-device-name-form {
      @apply w-[350px] grid gap-y-5 p-5;

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
export class ChangeDeviceNameDialog {

  #data = inject(MAT_DIALOG_DATA);
  #matDialogRef = inject(MatDialogRef<ChangeDeviceNameDialog>);
  #fb = inject(FormBuilder);
  deviceNameControl = this.#fb.nonNullable.control(this.name, Validators.required);

  get name() {
    return this.#data.name;
  }

  saveDeviceName() {
    this.#matDialogRef.close(this.deviceNameControl.value);
  }
}

@Component({
  template: `
      <h2 mat-dialog-title>Are you sure?</h2>
      <mat-dialog-content>
          <p class="text-lg font-medium">
              Are you sure you want to {{ action }} the device: “<b>{{ name }}</b>” ?
          </p>
      </mat-dialog-content>
      <mat-dialog-actions>
          <button mat-button [mat-dialog-close]="false" color="warn" [autofocus]="false" tabindex="-1">Cancel</button>
          <button mat-button [mat-dialog-close]="true" [autofocus]="true">Accept</button>
      </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButtonModule,
    MatDialogTitle
  ]
})
export class ConfirmationDeviceActionDialog {

  #data = inject(MAT_DIALOG_DATA);

  get action() {
    return this.#data.action;
  }

  get name() {
    return this.#data.name;
  }

}
