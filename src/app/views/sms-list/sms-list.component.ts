import { Component, signal } from '@angular/core';
import { BaseComponent } from '@rha/common/classes';
import { SMSContact, SMSData } from '@rha/common/types';
import { NgForOf } from '@angular/common';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import { delay, forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'rha-sms-list',
  standalone: true,
  imports: [
    NgForOf,
    MatProgressSpinner,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatPaginator,
    MatSortHeader,
  ],
  templateUrl: './sms-list.component.html',
  styleUrl: './sms-list.component.scss'
})
export class SmsListComponent extends BaseComponent {

  SMSContactList = signal<SMSContact[]>([]);
  Page = signal<number>(0);
  Columns = signal<string[]>([
    'PhoneNumber',
    'SMSContent',
    'SMSTime',
  ]);
  Length = signal(0);

  constructor() {
    super();
    of(true)
      .pipe(
        delay(150),
        tap(() => this.#fetchSmsList())
      ).subscribe();
  }

  #fetchSmsList(page: number = 1) {
    forkJoin({
      smsList: this.linkZone.getSmsList(page),
      smsStorage: this.linkZone.getSMSStorageState()
    }).subscribe(({ smsList, smsStorage }) => {
      const smsData: SMSData = smsList.result;
      this.SMSContactList.set(smsData.SMSList);
      this.Page.set(smsData.Page - 1);
      this.Length.set(smsStorage.result.TUseCount);
    });
  }

  goToPage({ pageIndex }: PageEvent) {
    this.Page.set(pageIndex);
    this.#fetchSmsList(pageIndex + 1);
  }

}
