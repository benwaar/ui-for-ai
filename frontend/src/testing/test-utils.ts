/**
 * Test Utilities
 *
 * Shared utilities and helpers for unit tests across the application.
 */

import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

/**
 * Mock localStorage for testing
 * Usage: const mockStorage = createMockLocalStorage();
 */
export function createMockLocalStorage(): Storage {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(store).length;
    },
  } as Storage;
}

/**
 * Mock document.body.classList for testing
 * Usage: const mockClassList = createMockClassList();
 */
export function createMockClassList(): DOMTokenList {
  const classes = new Set<string>();

  return {
    add: (...tokens: string[]) => {
      tokens.forEach((token) => classes.add(token));
    },
    remove: (...tokens: string[]) => {
      tokens.forEach((token) => classes.delete(token));
    },
    contains: (token: string) => classes.has(token),
    toggle: (token: string, force?: boolean) => {
      if (force !== undefined) {
        if (force) {
          classes.add(token);
        } else {
          classes.delete(token);
        }
        return force;
      }
      if (classes.has(token)) {
        classes.delete(token);
        return false;
      } else {
        classes.add(token);
        return true;
      }
    },
    replace: (oldToken: string, newToken: string) => {
      classes.delete(oldToken);
      classes.add(newToken);
      return true;
    },
    item: (index: number) => {
      return Array.from(classes)[index] || null;
    },
    entries: () => Array.from(classes).entries(),
    keys: () => Array.from(classes).keys(),
    values: () => Array.from(classes).values(),
    forEach: (callback: (value: string, key: number, parent: DOMTokenList) => void) => {
      Array.from(classes).forEach((value, index) =>
        callback(value, index, {} as DOMTokenList)
      );
    },
    get length() {
      return classes.size;
    },
    get value() {
      return Array.from(classes).join(' ');
    },
    set value(val: string) {
      classes.clear();
      val.split(/\s+/).forEach((token) => token && classes.add(token));
    },
    supports: () => false,
    [Symbol.iterator]: () => classes.values(),
  } as DOMTokenList;
}

/**
 * Setup HTTP testing for services
 * Returns HttpTestingController for verifying requests
 */
export function setupHttpTesting() {
  TestBed.configureTestingModule({
    providers: [provideHttpClient(), provideHttpClientTesting()],
  });

  return TestBed.inject(HttpTestingController);
}

/**
 * Wait for async operations in tests
 * Usage: await waitForAsync(() => { ... })
 */
export async function waitFor(ms = 0): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Create a spy object with multiple methods
 * Usage: const spy = createSpyObj('ServiceName', ['method1', 'method2']);
 */
export function createSpyObj(baseName: string, methodNames: string[]): Record<string, ReturnType<typeof vi.fn>> {
  const obj: Record<string, ReturnType<typeof vi.fn>> = {};
  methodNames.forEach((methodName) => {
    obj[methodName] = vi.fn().mockReturnValue(undefined);
  });
  return obj;
}
