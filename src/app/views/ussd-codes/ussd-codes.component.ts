import { Component, inject, signal } from '@angular/core';
import { USSD_CODES, UssdCode } from '@rha/common';
import { CurrencyPipe } from '@angular/common';
import { BaseComponent } from '@rha/common/classes';
import { TuiAlertService, TuiDialogService } from '@taiga-ui/core';
import { TUI_PROMPT } from '@taiga-ui/kit';
import { filter } from 'rxjs';

@Component({
  selector: 'rha-ussd-codes',
  standalone: true,
  imports: [
    CurrencyPipe
  ],
  templateUrl: './ussd-codes.component.html',
  styleUrl: './ussd-codes.component.scss'
})
export class UssdCodesComponent extends BaseComponent {

  #dialog = inject(TuiDialogService);
  #alert = inject(TuiAlertService);

  ussdCodes = signal<Array<UssdCode>>(USSD_CODES).asReadonly();

  showConfirmationUssdCode({ name, value }: UssdCode) {
    this.#dialog.open(
      TUI_PROMPT,
      {
        label: 'Are you sure?',
        size: 's',
        data: {
          content: `Are you sure you want to process the ussd code for: “${ name }” ?`,
          yes: 'Accept',
          no: 'Cancel'
        }
      },
    )
      .pipe(filter(Boolean))
      .subscribe(() => {
        this.linkZone.sendUssdCode(value)
          .subscribe((res) => {
            this.#alert.open(
              String(res.result?.UssdContent),
              {
                hasCloseButton: true,
                autoClose: 5000
              }
            ).subscribe();
          });
      });
  }

}
