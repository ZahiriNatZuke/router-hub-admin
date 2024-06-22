import { Component, inject, SecurityContext, signal } from '@angular/core';
import { USSD_CODES, UssdCode } from '@rha/common';
import { CurrencyPipe } from '@angular/common';
import { BaseComponent } from '@rha/common/classes';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { filter } from 'rxjs';
import { MatRipple } from '@angular/material/core';
import { MAT_BOTTOM_SHEET_DATA, MatBottomSheet } from '@angular/material/bottom-sheet';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'rha-ussd-codes',
  standalone: true,
  imports: [
    CurrencyPipe,
    MatRipple
  ],
  templateUrl: './ussd-codes.component.html',
  styleUrl: './ussd-codes.component.scss'
})
export class UssdCodesComponent extends BaseComponent {

  #dialog = inject(MatDialog);
  #bottomSheet = inject(MatBottomSheet);

  ussdCodes = signal<Array<UssdCode>>(USSD_CODES).asReadonly();
  processingUssdCode = signal<string>('');

  showConfirmationUssdCode({ name, value }: UssdCode) {
    if ( this.processingUssdCode() ) {
      return;
    }
    this.#dialog.open(
      ConfirmationUssdCodeDialog,
      { data: { name } }
    ).afterClosed()
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.processingUssdCode.set(value);
        this.linkZone.sendUssdCode(value)
          .subscribe((res) => {
            this.processingUssdCode.set('');
            this.#bottomSheet.open(
              UssdContentResultDialog,
              {
                data: {
                  content: String(res.result?.UssdContent)
                },
                autoFocus: 'dialog'
              }
            );
          });
      });
  }

}

@Component({
  template: `
      <h2 mat-dialog-title>Are you sure?</h2>
      <mat-dialog-content>
          <p class="text-lg font-medium">
              Are you sure you want to process the ussd code for: “<b>{{ name }}</b>” ?
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
export class ConfirmationUssdCodeDialog {

  #data = inject(MAT_DIALOG_DATA);

  get name() {
    return this.#data.name;
  }

}

@Component({
  template: `
      <div class="p-8">
          <p class="font-semibold prose dark:text-white">{{ content }}</p>
      </div>
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
export class UssdContentResultDialog {

  #data = inject(MAT_BOTTOM_SHEET_DATA);
  #domSanatizer = inject(DomSanitizer);

  get content() {
    return this.#domSanatizer.sanitize(SecurityContext.HTML, this.#data.content);
  }

}

