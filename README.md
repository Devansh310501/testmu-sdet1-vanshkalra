# testmu-sdet1-vanshkalra

Production-style test automation framework built with **Playwright** and **TypeScript**.

## Folder Structure

```
src/
  core/       → Base classes, custom fixtures, shared test setup
  pages/      → Page Object Model classes (one per page/component)
  api/        → API helper functions and HTTP clients
  utils/      → Utility functions (env reader, data generators, etc.)

tests/        → Test spec files (.spec.ts)
reports/      → Generated test reports and artifacts (git-ignored)
```

## Setup

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests in headed mode
npm run test:headed

# View HTML report
npm run test:report
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable       | Description                      |
| -------------- | -------------------------------- |
| `BASE_URL`     | Application base URL for UI tests |
| `API_BASE_URL` | API base URL for API tests        |
