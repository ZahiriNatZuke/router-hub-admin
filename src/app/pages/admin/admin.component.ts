import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TuiButtonModule, TuiHintModule, TuiScrollbarModule } from '@taiga-ui/core';
import { HeaderComponent } from '../../components/header/header.component';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BaseComponent } from '../../common/classes';

@Component({
  selector: 'rha-admin',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterOutlet,
    TuiButtonModule,
    TuiHintModule,
    HeaderComponent,
    TuiScrollbarModule,
    RouterLinkActive
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent extends BaseComponent {

  constructor() {
    super();
    this.linkZone.connect().subscribe();
    interval(5 * 1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.linkZone.heartBeat()
          .subscribe((res) => {
            console.log('[heartBeat]', res);
          });
      });
  }

}
