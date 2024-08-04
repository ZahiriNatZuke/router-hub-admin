import { Component, signal } from '@angular/core';
import { MatRipple } from '@angular/material/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'rha-sidebar',
  standalone: true,
  imports: [
    MatRipple,
    RouterLinkActive,
    RouterLink
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

  sidebar = signal<{ label: string, route: string }[]>([
    { label: 'Home', route: '/admin/home' },
    { label: 'SMS List', route: '/admin/sms-list' },
    { label: 'USSD Codes', route: '/admin/ussd-codes' },
    { label: 'Device Access', route: '/admin/device-access' }
  ]).asReadonly();

}
