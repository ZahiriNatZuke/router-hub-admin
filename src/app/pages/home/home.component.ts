import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { TuiButtonModule, TuiHintModule, TuiSvgModule } from '@taiga-ui/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'rha-home',
  standalone: true,
  imports: [
    NgOptimizedImage,
    TuiSvgModule,
    TuiButtonModule,
    RouterLink,
    RouterOutlet,
    TuiHintModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
}
