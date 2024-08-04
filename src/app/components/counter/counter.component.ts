import { Component, input } from '@angular/core';

@Component({
  selector: 'rha-counter',
  standalone: true,
  imports: [],
  templateUrl: './counter.component.html',
  styleUrl: './counter.component.scss'
})
export class CounterComponent {

  counter = input.required({
    transform: (value: number) => {
      return {
        hours: Math.floor(value / 3600) % 24,
        minutes: Math.floor(value / 60) % 60,
        seconds: value % 60
      }
    }
  });

}
