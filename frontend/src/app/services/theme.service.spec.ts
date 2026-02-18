import { TestBed } from '@angular/core/testing';
import { ThemeService, Theme } from './theme.service';
import { createMockLocalStorage, createMockClassList } from '../../testing/test-utils';

describe('ThemeService', () => {
  let service: ThemeService;
  let mockLocalStorage: Storage;
  let mockClassList: DOMTokenList;
  let originalLocalStorage: Storage;
  let originalBodyClassList: DOMTokenList;

  beforeEach(() => {
    // Create mocks
    mockLocalStorage = createMockLocalStorage();
    mockClassList = createMockClassList();

    // Save originals
    originalLocalStorage = globalThis.localStorage;
    originalBodyClassList = document.body.classList;

    // Replace with mocks
    Object.defineProperty(globalThis, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(document.body, 'classList', {
      value: mockClassList,
      writable: true,
      configurable: true,
    });

    TestBed.configureTestingModule({});
  });

  afterEach(() => {
    // Restore originals
    Object.defineProperty(globalThis, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });

    Object.defineProperty(document.body, 'classList', {
      value: originalBodyClassList,
      writable: true,
      configurable: true,
    });
  });

  it('should be created', () => {
    service = TestBed.inject(ThemeService);
    expect(service).toBeTruthy();
  });

  it('should initialize with default theme (colorful) when localStorage is empty', () => {
    service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe('colorful');
  });

  it('should apply initial theme class to document body on initialization', () => {
    service = TestBed.inject(ThemeService);

    expect(mockClassList.contains('colorful-theme')).toBe(true);
    expect(mockClassList.contains('dark-theme')).toBe(false);
  });

  it('should load theme from localStorage on initialization', () => {
    mockLocalStorage.setItem('ui-for-ai-theme', 'dark');

    service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe('dark');
    expect(mockClassList.contains('dark-theme')).toBe(true);
    expect(mockClassList.contains('colorful-theme')).toBe(false);
  });

  it('should fallback to default theme for invalid localStorage value', () => {
    mockLocalStorage.setItem('ui-for-ai-theme', 'invalid-theme');

    service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe('colorful');
  });

  it('should expose theme as observable', async () => {
    service = TestBed.inject(ThemeService);

    const theme = await new Promise<Theme>((resolve) => {
      service.theme$.subscribe((theme: Theme) => {
        resolve(theme);
      });
    });

    expect(theme).toBe('colorful');
  });

  it('should update theme with setTheme()', () => {
    service = TestBed.inject(ThemeService);

    service.setTheme('dark');

    expect(service.getCurrentTheme()).toBe('dark');
  });

  it('should save theme to localStorage when setTheme() is called', () => {
    service = TestBed.inject(ThemeService);

    service.setTheme('dark');

    expect(mockLocalStorage.getItem('ui-for-ai-theme')).toBe('dark');
  });

  it('should apply theme class to body when setTheme() is called', () => {
    service = TestBed.inject(ThemeService);

    service.setTheme('dark');

    expect(mockClassList.contains('dark-theme')).toBe(true);
    expect(mockClassList.contains('colorful-theme')).toBe(false);
  });

  it('should remove old theme class when switching themes', () => {
    service = TestBed.inject(ThemeService);

    service.setTheme('dark');
    expect(mockClassList.contains('dark-theme')).toBe(true);
    expect(mockClassList.contains('colorful-theme')).toBe(false);

    service.setTheme('colorful');
    expect(mockClassList.contains('colorful-theme')).toBe(true);
    expect(mockClassList.contains('dark-theme')).toBe(false);
  });

  it('should emit new theme value through theme$ observable', async () => {
    service = TestBed.inject(ThemeService);

    const expectedThemes: Theme[] = ['colorful', 'dark'];
    const emissions: Theme[] = [];

    const subscription = service.theme$.subscribe((theme: Theme) => {
      emissions.push(theme);
    });

    service.setTheme('dark');

    // Wait for emissions to complete
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(emissions).toEqual(expectedThemes);
    subscription.unsubscribe();
  });

  it('should toggle theme from colorful to dark', () => {
    service = TestBed.inject(ThemeService);

    service.toggleTheme();

    expect(service.getCurrentTheme()).toBe('dark');
    expect(mockClassList.contains('dark-theme')).toBe(true);
  });

  it('should toggle theme from dark to colorful', () => {
    mockLocalStorage.setItem('ui-for-ai-theme', 'dark');
    service = TestBed.inject(ThemeService);

    service.toggleTheme();

    expect(service.getCurrentTheme()).toBe('colorful');
    expect(mockClassList.contains('colorful-theme')).toBe(true);
  });

  it('should handle localStorage errors gracefully when loading', () => {
    vi.spyOn(mockLocalStorage, 'getItem').mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // Suppress console warnings during test
    });

    service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe('colorful');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Failed to load theme from localStorage:',
      expect.any(Error)
    );

    consoleWarnSpy.mockRestore();
  });

  it('should handle localStorage errors gracefully when saving', () => {
    service = TestBed.inject(ThemeService);

    vi.spyOn(mockLocalStorage, 'setItem').mockImplementation(() => {
      throw new Error('localStorage error');
    });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {
      // Suppress console warnings during test
    });

    service.setTheme('dark');

    expect(service.getCurrentTheme()).toBe('dark');
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Failed to save theme to localStorage:',
      expect.any(Error)
    );

    consoleWarnSpy.mockRestore();
  });

  it('should return correct current theme with getCurrentTheme()', () => {
    service = TestBed.inject(ThemeService);

    expect(service.getCurrentTheme()).toBe('colorful');

    service.setTheme('dark');
    expect(service.getCurrentTheme()).toBe('dark');

    service.setTheme('colorful');
    expect(service.getCurrentTheme()).toBe('colorful');
  });
});
