# Testing Quick Start Guide

## Quick Commands

### Unit Tests (Vitest)
```bash
pnpm test              # Watch mode (auto-rerun on file changes)
pnpm test:run          # Run once
pnpm test:ui           # Visual test runner
pnpm test:coverage     # Generate coverage report
```

### E2E Tests (Playwright)
```bash
pnpm test:e2e          # Run all E2E tests
pnpm test:e2e:ui       # Interactive UI mode
pnpm test:e2e:headed   # See the browser
pnpm test:e2e:debug    # Step through tests
```

### Run Everything
```bash
pnpm test:all          # Run both unit and E2E tests
```

## File Locations

### Configuration
- `vitest.config.ts` - Vitest configuration
- `playwright.config.ts` - Playwright configuration
- `src/test/setup.ts` - Test setup and mocks

### Test Files
- `src/**/*.test.ts` - Unit tests
- `src/**/*.test.tsx` - Component tests
- `tests-e2e/**/*.spec.ts` - E2E tests

### Test Utilities
- `src/test/test-utils.tsx` - React Testing Library helpers
- `src/test/mock-data.ts` - Mock data factory
- `tests-e2e/fixtures.ts` - Playwright fixtures
- `tests-e2e/helpers.ts` - Playwright helper functions

## Writing Your First Test

### Unit Test Example
Create a file `src/lib/my-function.test.ts`:

```typescript
import { describe, expect, it } from "vitest";
import { myFunction } from "./my-function";

describe("myFunction", () => {
  it("should work correctly", () => {
    expect(myFunction(1, 2)).toBe(3);
  });
});
```

### Component Test Example
Create a file `src/components/MyComponent.test.tsx`:

```typescript
import { describe, expect, it } from "vitest";
import { MyComponent } from "./MyComponent";
import { renderWithProviders, screen, userEvent } from "@/test/test-utils";

describe("MyComponent", () => {
  it("should render correctly", () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });

  it("should handle clicks", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyComponent />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Clicked!")).toBeInTheDocument();
  });
});
```

### E2E Test Example
Create a file `tests-e2e/my-feature.spec.ts`:

```typescript
import { test, expect } from "./fixtures";

test.describe("My Feature", () => {
  test("should navigate correctly", async ({ page }) => {
    await page.goto("/dashboard/my-feature");
    await expect(page.getByRole("heading")).toBeVisible();
  });
});
```

## Test Structure

### Good Test Names
```typescript
// ✅ Good - describes what it tests
it("should format currency with commas", () => {});
it("should disable submit button when form is invalid", () => {});
it("should navigate to cattle page when link is clicked", () => {});

// ❌ Bad - unclear what's being tested
it("works", () => {});
it("test1", () => {});
```

### AAA Pattern
```typescript
it("should do something", () => {
  // Arrange - Set up test data
  const input = 100;

  // Act - Perform the action
  const result = formatCurrency(input);

  // Assert - Verify the result
  expect(result).toContain("100");
});
```

## Common Patterns

### Mocking Functions
```typescript
import { vi } from "vitest";

const mockFn = vi.fn();
mockFn.mockReturnValue("mocked value");
expect(mockFn).toHaveBeenCalledWith("arg");
```

### Mocking Modules
```typescript
vi.mock("@/db", () => ({
  db: {
    query: {
      cattle: {
        findMany: vi.fn(() => [mockCattle()]),
      },
    },
  },
}));
```

### Testing Async Code
```typescript
it("should fetch data", async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

### Testing User Interactions
```typescript
const user = userEvent.setup();
await user.click(screen.getByRole("button"));
await user.type(screen.getByRole("textbox"), "Hello");
```

### Waiting for Elements (Playwright)
```typescript
await page.getByRole("button").waitFor();
await expect(page.getByText("Success")).toBeVisible();
```

## Debugging Tips

### Debug Unit Tests
1. Add `console.log()` in your test
2. Use `screen.debug()` to see the DOM
3. Run with `--ui` flag for visual debugging

### Debug E2E Tests
1. Use `--headed` to see the browser
2. Use `--debug` to step through tests
3. Add `await page.pause()` to pause execution

### Check What's Rendered
```typescript
import { screen } from "@/test/test-utils";

screen.debug(); // Prints entire DOM
screen.debug(screen.getByRole("button")); // Prints specific element
```

## Tips

1. **Keep tests simple** - One concept per test
2. **Use descriptive names** - Future you will thank you
3. **Test user behavior** - Not implementation details
4. **Mock external dependencies** - Database, APIs, etc.
5. **Run tests often** - Catch issues early

## Next Steps

- Read the full [TESTING.md](./TESTING.md) for comprehensive documentation
- Check example tests in `src/` and `tests-e2e/`
- Run `pnpm test:ui` to explore the test UI
- Try writing a test for existing code

## Need Help?

- Full documentation: `TESTING.md`
- Vitest docs: https://vitest.dev
- Testing Library docs: https://testing-library.com
- Playwright docs: https://playwright.dev
