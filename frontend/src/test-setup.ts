import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Initialize the Angular testing environment
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);

// Add jasmine global for createSpyObj (Vi test doesn't have it)
// @ts-expect-error - Adding jasmine global for tests
globalThis.jasmine = {
  createSpyObj: (baseName: string, methodNames: string[] | Record<string, unknown>): Record<string, ReturnType<typeof vi.fn>> => {
    const obj: Record<string, ReturnType<typeof vi.fn>> = {};

    if (Array.isArray(methodNames)) {
      methodNames.forEach((methodName) => {
        obj[methodName] = vi.fn();
      });
    } else {
      Object.keys(methodNames).forEach((methodName) => {
        obj[methodName] = vi.fn().mockReturnValue(methodNames[methodName]);
      });
    }

    return obj;
  },
};
