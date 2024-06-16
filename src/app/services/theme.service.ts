import { computed, inject, Injectable, PLATFORM_ID, RendererFactory2, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { Themes } from '@rha/common/types/enums';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  #document: Document = inject(DOCUMENT);
  #htmlElement = this.#document.querySelector('html');
  #renderer2 = inject(RendererFactory2).createRenderer(this.#document, null);
  #mediaMatcher = inject(MediaMatcher);
  #theme = signal<Themes>(Themes.Light);
  #platform = inject(PLATFORM_ID);

  isDarkMode = computed(() => this.#theme() === Themes.Dark);

  get theme() {
    return this.#theme.asReadonly();
  }

  setTheme(theme: Themes) {
    if ( isPlatformBrowser(this.#platform) ) {
      this.#renderer2.setAttribute(this.#htmlElement, 'data-theme', theme);
      this.#renderer2.removeClass(this.#document.body, this.#theme());
      this.#renderer2.addClass(this.#document.body, theme);
      localStorage.setItem('RHA-THEME', theme);
      this.#theme.set(theme);
    }
  }

  getColorPreference() {
    if ( isPlatformBrowser(this.#platform) ) {
      if ( localStorage.getItem('RHA-THEME') ) {
        this.#theme.set(localStorage.getItem('RHA-THEME') as Themes);
      } else {
        const themeQuery = this.#mediaMatcher.matchMedia('(prefers-color-scheme: dark)');
        this.#theme.set(themeQuery.matches ? Themes.Dark : Themes.Light);
        localStorage.setItem('RHA-THEME', this.#theme());
      }
      this.#renderer2.setAttribute(this.#htmlElement, 'data-theme', this.#theme());
      this.#renderer2.addClass(this.#document.body, this.#theme());
    }
  }

}
