import '@testing-library/jest-dom'

// jsdom doesn't implement ResizeObserver, which PreviewViewport uses.
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
