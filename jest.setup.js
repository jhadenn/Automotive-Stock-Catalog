// Optional: add any setup code for jest
import '@testing-library/jest-dom'

// Add Jest DOM matchers
import '@testing-library/jest-dom';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock next/router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  }),
}));

// Suppress console warnings and errors during tests
global.console = {
  ...console,
  // Uncomment to ignore specific console methods during tests
  error: jest.fn(), // Silence React act() warnings in tests
  warn: jest.fn(),  // Silence React warnings
  // log: jest.fn(),
};

// Set testing environment to have more consistent timers
jest.setTimeout(10000); // Increase timeout for async tests 