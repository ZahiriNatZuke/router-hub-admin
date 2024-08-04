import { Component, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { ThemeService } from '@rha/services';
import { Themes } from '@rha/common/types';

@Component({
  selector: 'rha-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrls: [ './theme-toggle.component.scss' ],
  imports: [ NgClass ],
  standalone: true
})
export class ThemeToggleComponent {

  #themeService = inject(ThemeService);
  theme = this.#themeService.theme;
  isDarkMode = this.#themeService.isDarkMode;

  onChange() {
    this.#themeService.setTheme(this.#themeService.isDarkMode() ? Themes.Light : Themes.Dark);
  }

}
