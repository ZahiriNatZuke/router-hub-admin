import { computed, inject, Injectable, PLATFORM_ID, RendererFactory2, signal } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { MediaMatcher } from '@angular/cdk/layout';
import { Themes } from '@rha/common/types';
import { environment } from "@rha/env";

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
      localStorage.setItem(environment.THEME_KEY, theme);
      this.#theme.set(theme);
    }
  }

  getColorPreference() {
    if ( isPlatformBrowser(this.#platform) ) {
      if ( localStorage.getItem(environment.THEME_KEY) ) {
        this.#theme.set(localStorage.getItem(environment.THEME_KEY) as Themes);
      } else {
        const themeQuery = this.#mediaMatcher.matchMedia('(prefers-color-scheme: dark)');
        this.#theme.set(themeQuery.matches ? Themes.Dark : Themes.Light);
        localStorage.setItem(environment.THEME_KEY, this.#theme());
      }
      this.#renderer2.setAttribute(this.#htmlElement, 'data-theme', this.#theme());
      this.#renderer2.removeClass(this.#document.body, ( this.#theme() === Themes.Dark ) ? Themes.Light : Themes.Dark);
      this.#renderer2.addClass(this.#document.body, this.#theme());
    }
  }

}
