import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TuiButtonModule, TuiHintModule } from '@taiga-ui/core';
import { HeaderComponent } from '../../components/header/header.component';
import { LinkZoneService } from '../../services/link-zone.service';
import { interval } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'rha-admin',
  standalone: true,
  imports: [
    NgOptimizedImage,
    RouterLink,
    RouterOutlet,
    TuiButtonModule,
    TuiHintModule,
    HeaderComponent
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent {

  #linkZone = inject(LinkZoneService);

  constructor() {
    interval(5 * 1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        console.log('[getSmsList]');
       this.#linkZone.getSmsList().subscribe(console.log);
      });
  }

}
