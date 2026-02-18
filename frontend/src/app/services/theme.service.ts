import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export type Theme = 'colorful' | 'dark';

/**
 * ThemeService - Manages application theme state
 *
 * Features:
 * - Two themes: 'colorful' (colorblind-accessible) and 'dark' (dark mode)
 * - Theme persistence via localStorage
 * - Reactive theme updates using RxJS Observable
 * - Applies theme class to document body for CSS cascading
 *
 * Usage:
 * ```typescript
 * constructor(private themeService: ThemeService) {}
 *
 * ngOnInit() {
 *   this.themeService.theme$.subscribe(theme => {
 *     console.log('Current theme:', theme);
 *   });
 * }
 *
 * toggleTheme() {
 *   const current = this.themeService.getCurrentTheme();
 *   this.themeService.setTheme(current === 'dark' ? 'colorful' : 'dark');
 * }
 * ```
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'ui-for-ai-theme';
  private readonly DEFAULT_THEME: Theme = 'colorful';

  private themeSubject: BehaviorSubject<Theme>;
  public theme$: Observable<Theme>;

  constructor() {
    // Initialize theme from localStorage or use default
    const savedTheme = this.loadThemeFromStorage();
    this.themeSubject = new BehaviorSubject<Theme>(savedTheme);
    this.theme$ = this.themeSubject.asObservable();

    // Apply initial theme to body
    this.applyThemeToBody(savedTheme);
  }

  /**
   * Set the current theme
   * Updates localStorage and applies CSS class to body
   */
  setTheme(theme: Theme): void {
    this.themeSubject.next(theme);
    this.saveThemeToStorage(theme);
    this.applyThemeToBody(theme);
  }

  /**
   * Get the current theme value (synchronous)
   */
  getCurrentTheme(): Theme {
    return this.themeSubject.value;
  }

  /**
   * Toggle between colorful and dark themes
   */
  toggleTheme(): void {
    const current = this.getCurrentTheme();
    const newTheme: Theme = current === 'dark' ? 'colorful' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Load theme from localStorage
   */
  private loadThemeFromStorage(): Theme {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === 'colorful' || saved === 'dark') {
        return saved;
      }
    } catch (error) {
      console.warn('Failed to load theme from localStorage:', error);
    }
    return this.DEFAULT_THEME;
  }

  /**
   * Save theme to localStorage
   */
  private saveThemeToStorage(theme: Theme): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, theme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  }

  /**
   * Apply theme CSS class to document body
   * Removes previous theme class and adds new one
   */
  private applyThemeToBody(theme: Theme): void {
    const body = document.body;

    // Remove all theme classes
    body.classList.remove('colorful-theme', 'dark-theme');

    // Add current theme class
    body.classList.add(`${theme}-theme`);
  }
}
