import { Component, computed, signal } from '@angular/core';
import { BaseComponent } from '@rha/common/classes';
import { SMSData } from '@rha/common/types';
import { TuiTableModule, TuiTablePaginationModule } from '@taiga-ui/addon-table';
import { TuiLetModule } from '@taiga-ui/cdk';
import { NgForOf } from '@angular/common';
import { TuiPaginationModule } from '@taiga-ui/kit';
import { TuiScrollbarModule } from '@taiga-ui/core';

@Component({
  selector: 'rha-sms-list',
  standalone: true,
  imports: [
    TuiTableModule,
    TuiLetModule,
    NgForOf,
    TuiTablePaginationModule,
    TuiPaginationModule,
    TuiScrollbarModule
  ],
  templateUrl: './sms-list.component.html',
  styleUrl: './sms-list.component.scss'
})
export class SmsListComponent extends BaseComponent {

  SMSContactList = signal<any[]>([]);
  Page = signal<number>(1);
  TotalPageCount = signal<number>(0);
  columnsSettings = signal<{ column: string, header: string }[]>([
    {
      column: 'SMSId',
      header: 'ID'
    },
    {
      column: 'PhoneNumber',
      header: 'Contact'
    },
    {
      column: 'SMSContent',
      header: 'Message'
    },
    {
      column: 'SMSTime',
      header: 'Date/Time'
    },
  ]);
  columns = computed(() => this.columnsSettings().map(({ column }) => column));
  currentPage = computed(() => this.Page() - 1);

  constructor() {
    super();
    this.fetchSmsList();
  }

  private fetchSmsList(page: number = 1) {
    this.linkZone.getSmsList(page).subscribe((res) => {
      const smsData: SMSData = res.result;
      this.SMSContactList.set(smsData.SMSList);
      this.Page.set(smsData.Page);
      this.TotalPageCount.set(smsData.TotalPageCount);
    });
  }

  public goToPage($event: number) {
    this.Page.set($event + 1);
    this.fetchSmsList($event + 1);
  }
}
