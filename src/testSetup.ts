import * as matchers from "@testing-library/jest-dom/matchers";
import { expect } from "vitest";

expect.extend(matchers);

class MockResizeObserver implements ResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe(target: Element): void {
    this.callback(
      [
        {
          target,
          contentRect: {
            x: 0,
            y: 0,
            width: 800,
            height: 600,
            top: 0,
            right: 800,
            bottom: 600,
            left: 0,
            toJSON: () => ({}),
          },
          borderBoxSize: [],
          contentBoxSize: [],
          devicePixelContentBoxSize: [],
        },
      ],
      this,
    );
  }

  unobserve(): void {
    // No-op in jsdom unit environment
  }

  disconnect(): void {
    // No-op in jsdom unit environment
  }
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = MockResizeObserver;
}

if (typeof globalThis.DOMMatrixReadOnly === "undefined") {
  class MockDOMMatrixReadOnly {
    m22 = 1;
    a = 1;
    b = 0;
    c = 0;
    d = 1;
    e = 0;
    f = 0;
  }
  Object.defineProperty(globalThis, "DOMMatrixReadOnly", {
    value: MockDOMMatrixReadOnly,
    configurable: true,
    writable: true,
  });
}

if (typeof HTMLElement !== "undefined") {
  if (typeof HTMLElement.prototype.scrollIntoView !== "function") {
    HTMLElement.prototype.scrollIntoView = () => {
      // No-op in jsdom unit environment
    };
  }
  Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
    configurable: true,
    get() {
      return 800;
    },
  });
  Object.defineProperty(HTMLElement.prototype, "offsetHeight", {
    configurable: true,
    get() {
      return 600;
    },
  });
}
