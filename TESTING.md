# Testing Guide

This document provides comprehensive guidance on testing in the ARMA Dashboard project.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Unit Testing with Vitest](#unit-testing-with-vitest)
- [Integration Testing with Playwright](#integration-testing-with-playwright)
- [Writing Tests](#writing-tests)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)

## Overview

The ARMA Dashboard uses a comprehensive testing strategy with two main testing frameworks:

- **Vitest**: For unit and component tests
- **Playwright**: For end-to-end (E2E) and integration tests

## Testing Stack

### Unit Testing
- **Vitest**: Modern, fast unit test framework with native ESM support
- **@testing-library/react**: Component testing utilities
- **@testing-library/user-event**: User interaction simulation
- **@testing-library/jest-dom**: Custom DOM matchers
- **happy-dom**: Lightweight DOM implementation

### E2E Testing
- **Playwright**: Modern E2E testing framework with cross-browser support
- **Custom fixtures**: Reusable test setup for authentication and common scenarios

## Running Tests

### Unit Tests

```bash
# Run tests in watch mode (recommended for development)
pnpm test

# Run tests once
pnpm test:run

# Run tests with UI (visual test runner)
pnpm test:ui

# Run tests with coverage report
pnpm test:coverage
```

### E2E Tests

```bash
# Run all E2E tests
pnpm test:e2e

# Run E2E tests with UI (interactive mode)
pnpm test:e2e:ui

# Run E2E tests in headed mode (see browser)
pnpm test:e2e:headed

# Debug E2E tests
pnpm test:e2e:debug
```

### Run All Tests

```bash
# Run both unit and E2E tests
pnpm test:all
```

## Unit Testing with Vitest

### Configuration

The Vitest configuration is located in `vitest.config.ts`. It's configured to:
- Use happy-dom for DOM environment
- Load setup file from `src/test/setup.ts`
- Support TypeScript and React
- Handle path aliases (`@/` -> `src/`)

### Test File Structure

Unit tests should be colocated with the code they test:

```
src/
├── lib/
│   ├── utils.ts
│   └── utils.test.ts
├── components/
│   └── ui/
│       ├── button.tsx
│       └── button.test.tsx
└── features/
    └── cattle/
        ├── actions.ts
        └── actions.test.ts
```

### Writing Unit Tests

#### Testing Utility Functions

```typescript
// src/lib/utils.test.ts
import { describe, expect, it } from "vitest";
import { formatCurrency } from "./utils";

describe("formatCurrency", () => {
  it("should format currency correctly", () => {
    expect(formatCurrency(1000)).toContain("1,000");
  });

  it("should handle zero amount", () => {
    const result = formatCurrency(0);
    expect(result).toBeDefined();
  });
});
```

#### Testing React Components

```typescript
// src/components/ui/button.test.tsx
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";

describe("Button Component", () => {
  it("should render correctly", () => {
    renderWithProviders(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("should handle click events", async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

#### Testing Server Actions

```typescript
// src/features/cattle/actions.test.ts
import { describe, expect, it, vi, beforeEach } from "vitest";
import { createCattle } from "./actions";

// Mock the database
vi.mock("@/db", () => ({
  db: {
    insert: vi.fn(),
  },
}));

describe("createCattle", () => {
  it("should create cattle successfully", async () => {
    const mockData = {
      name: "Test Cattle",
      weight: 500,
      // ... other fields
    };

    const result = await createCattle(mockData);
    expect(result.error).toBeUndefined();
    expect(result.data).toBeDefined();
  });
});
```

### Test Utilities

#### renderWithProviders

Use `renderWithProviders` instead of `render` to wrap components with necessary providers:

```typescript
import { renderWithProviders, screen } from "@/test/test-utils";

renderWithProviders(<MyComponent />);
```

#### Mock Data Factory

Use the mock data factory to generate test data:

```typescript
import { mockCattle, createMockArray } from "@/test/mock-data";

const cattle = mockCattle();
const cattleList = createMockArray(mockCattle, 10);
```

## Integration Testing with Playwright

### Configuration

The Playwright configuration is in `playwright.config.ts`. It's configured to:
- Run tests in `tests-e2e/` directory
- Start dev server automatically
- Run on Chromium by default
- Generate HTML reports
- Capture screenshots and videos on failure

### Test File Structure

E2E tests are organized by feature:

```
tests-e2e/
├── fixtures.ts          # Custom test fixtures
├── helpers.ts           # Helper functions
├── homepage.spec.ts     # Homepage tests
├── dashboard-navigation.spec.ts
└── form-interactions.spec.ts
```

### Writing E2E Tests

#### Basic Test Structure

```typescript
import { test, expect } from "./fixtures";
import { navigateToPage } from "./helpers";

test.describe("Feature Name", () => {
  test("should do something", async ({ page }) => {
    await navigateToPage(page, "/dashboard");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
```

#### Using Helpers

```typescript
import { fillFormField, clickButton, waitForToast } from "./helpers";

test("should submit form", async ({ page }) => {
  await page.goto("/dashboard/cattle/new");

  await fillFormField(page, "Name", "Test Cattle");
  await clickButton(page, "Submit");
  await waitForToast(page, "Success");
});
```

#### Using Fixtures

```typescript
test("should access authenticated page", async ({ page, authenticatedUser }) => {
  // authenticatedUser fixture provides mock auth
  await page.goto("/dashboard");
  expect(authenticatedUser.role).toBe("admin");
});
```

### Helper Functions

Available helper functions in `tests-e2e/helpers.ts`:

- `navigateToPage(page, path)`: Navigate and wait for load
- `waitForPageLoad(page)`: Wait for network idle
- `fillFormField(page, label, value)`: Fill form input
- `selectOption(page, label, option)`: Select dropdown option
- `clickButton(page, text)`: Click button by text
- `waitForToast(page, message)`: Wait for toast notification
- `expectElementToBeVisible(page, text)`: Check visibility

## Best Practices

### General Testing Principles

1. **Test Behavior, Not Implementation**: Focus on what the user sees and does
2. **Follow AAA Pattern**: Arrange, Act, Assert
3. **Keep Tests Independent**: Each test should run in isolation
4. **Use Descriptive Names**: Test names should clearly describe what they test
5. **Avoid Test Duplication**: Extract common logic into helpers

### Unit Testing Best Practices

1. **Mock External Dependencies**: Use `vi.mock()` for external modules
2. **Test Edge Cases**: Include tests for error states and boundary conditions
3. **Use Snapshot Tests Sparingly**: Prefer explicit assertions
4. **Keep Tests Fast**: Unit tests should run in milliseconds

```typescript
// Good: Explicit assertion
expect(result).toBe("expected value");

// Avoid: Snapshot (unless necessary)
expect(result).toMatchSnapshot();
```

### E2E Testing Best Practices

1. **Use Page Object Pattern**: Encapsulate page interactions
2. **Wait for Elements**: Always wait for elements before interacting
3. **Test User Flows**: Test complete user journeys, not isolated features
4. **Handle Flakiness**: Use proper waits and retries

```typescript
// Good: Wait for element
await page.getByRole("button").waitFor();
await page.getByRole("button").click();

// Avoid: Immediate action without wait
await page.getByRole("button").click();
```

### Component Testing Best Practices

1. **Test Accessibility**: Use semantic queries (getByRole, getByLabel)
2. **Simulate Real Interactions**: Use userEvent instead of fireEvent
3. **Test Loading States**: Include tests for async states
4. **Test Error States**: Verify error handling

```typescript
// Good: Semantic query
screen.getByRole("button", { name: "Submit" });

// Avoid: Generic query
screen.getByTestId("submit-button");
```

## Writing Test Cases

### What to Test

**Do Test:**
- User interactions (clicks, typing, navigation)
- Form validation
- Data display and formatting
- Error handling
- Loading states
- Accessibility (keyboard navigation, screen readers)

**Don't Test:**
- Implementation details
- Third-party libraries
- Styling (unless it affects functionality)
- Console output (unless it's an error)

### Test Organization

```typescript
describe("Feature/Component Name", () => {
  describe("when condition", () => {
    it("should do something", () => {
      // test
    });
  });

  describe("when different condition", () => {
    it("should do something else", () => {
      // test
    });
  });
});
```

## Coverage

### Viewing Coverage

```bash
pnpm test:coverage
```

This generates a coverage report in `coverage/` directory. Open `coverage/index.html` in a browser to view detailed coverage.

### Coverage Goals

- **Statements**: Aim for 80%+
- **Branches**: Aim for 75%+
- **Functions**: Aim for 80%+
- **Lines**: Aim for 80%+

Focus on critical paths and business logic. Don't chase 100% coverage at the expense of meaningful tests.

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run unit tests
        run: pnpm test:run

      - name: Install Playwright Browsers
        run: pnpm exec playwright install --with-deps chromium

      - name: Run E2E tests
        run: pnpm test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Common Issues

#### Vitest

**Issue**: Tests fail with "Cannot find module '@/...'"
**Solution**: Check that path aliases are configured in `vitest.config.ts`

**Issue**: Tests timeout
**Solution**: Increase timeout in test: `test("...", async () => { ... }, 10000)`

#### Playwright

**Issue**: "Target page closed"
**Solution**: Add proper waits before navigation

**Issue**: Tests are flaky
**Solution**: Use `waitFor` and increase timeout for specific assertions

**Issue**: "Browser not found"
**Solution**: Run `pnpm exec playwright install`

### Debugging

#### Debug Vitest Tests

```bash
# Run specific test file
pnpm test src/lib/utils.test.ts

# Run tests matching pattern
pnpm test --grep "formatCurrency"

# Run with UI
pnpm test:ui
```

#### Debug Playwright Tests

```bash
# Debug mode (step through tests)
pnpm test:e2e:debug

# Headed mode (see browser)
pnpm test:e2e:headed

# Run specific test file
pnpm test:e2e homepage.spec.ts
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library Documentation](https://testing-library.com/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)

## Getting Help

If you encounter issues or have questions:
1. Check this documentation
2. Search existing issues in the repository
3. Ask in the team chat
4. Create a new issue with detailed reproduction steps
