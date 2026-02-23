# testmu-sdet1-vanshkalra

A production-style test automation framework built with **Playwright** and **TypeScript**, extended with an **AI-powered failure analysis pipeline** that uses Anthropic Claude to automatically explain test failures in plain language.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [AI Failure Analysis Pipeline](#ai-failure-analysis-pipeline)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Reports](#reports)
- [Path Aliases](#path-aliases)
- [CI Behaviour](#ci-behaviour)

---

## Overview

This framework combines standard Playwright E2E and API test automation with an intelligent failure triage layer. When a test fails, the custom Playwright reporter captures the error, ships it to Claude via the Anthropic API, and writes a structured JSON explanation to disk — including root cause, likely reason, suggested fix, and confidence level — without blocking test execution.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Test runner | Playwright `^1.58.2` |
| Language | TypeScript `^5.9.3` (strict mode) |
| AI provider | Anthropic Claude (`@anthropic-ai/sdk ^0.78.0`) |
| Environment | dotenv `^17.3.1` |
| Runtime | Node.js (CommonJS) |
| Browser | Chromium (Desktop Chrome) |

---

## Project Structure

```
testmu-sdet1-vanshkalra/
├── src/
│   ├── core/
│   │   ├── aiReporter.ts        # Custom Playwright reporter — hooks into onTestEnd / onEnd
│   │   ├── llmClient.ts         # Anthropic SDK wrapper with retry, timeout, model selection
│   │   ├── failureExplainer.ts  # Orchestrates cache lookup → LLM call → cache write
│   │   └── failureCache.ts      # In-memory SHA-256 cache for deduplicating LLM calls
│   ├── pages/
│   │   └── BasePage.ts          # Base Page Object class — extend per page/component
│   ├── api/
│   │   └── BaseApi.ts           # Base API helper — extend per endpoint group
│   └── utils/
│       └── env.helper.ts        # Safe environment variable reader with fallback
├── tests/
│   └── smoke.spec.ts            # Example spec (intentional failure for AI demo)
├── reports/                     # Generated artifacts (git-ignored)
│   ├── ai-failure-report.json   # AI explanations written after each run
│   ├── playwright-report/       # HTML report
│   └── test-results/            # Screenshots, traces
├── playwright.config.ts
├── tsconfig.json
├── .env                         # Local secrets (git-ignored)
├── .env.example                 # Template — copy to .env and fill in values
└── package.json
```

---

## AI Failure Analysis Pipeline

When any test fails or times out, the following pipeline runs automatically — without blocking or slowing down the rest of the test suite.

```
Test failure
     │
     ▼
aiReporter.ts  ──  onTestEnd()
     │              Extracts: title, file, errorMessage, stackTrace,
     │              retry count, screenshot path, trace path
     │
     ▼
failureExplainer.ts  ──  processFailure()
     │
     ├── generateHash(errorMessage + stackTrace)  ──  SHA-256 via Node crypto
     │
     ├── Cache HIT?  ──────────────────────────────────────────► return cached explanation
     │
     └── Cache MISS
              │
              ▼
         llmClient.ts  ──  explainFailure()
              │
              ├── Stack trace < 800 chars  →  claude-3-haiku-20240307
              ├── Stack trace ≥ 800 chars  →  claude-3-sonnet-20240229
              │
              ├── Timeout: 10 seconds (Promise.race)
              ├── Retries: up to 2 (3 total attempts)
              └── On all retries exhausted → FALLBACK explanation returned
              │
              ▼
         failureCache.set(hash, explanation)
              │
              ▼
     onEnd()  →  reports/ai-failure-report.json
```

### AI Report Entry Shape

Each failed test produces one entry in `reports/ai-failure-report.json`:

```json
{
  "testTitle": "Login – invalid credentials shows error",
  "file": "/tests/auth/login.spec.ts",
  "retry": 0,
  "errorMessage": "expect(received).toBe(expected)",
  "explanation": {
    "root_cause": "Assertion mismatch on expected error message text",
    "likely_reason": "The error message returned by the server changed after a recent API update",
    "suggested_fix": "Update the expected string in the assertion to match the current API response",
    "confidence": "High"
  }
}
```

### Cost Protection

- **Deduplication cache** — identical `errorMessage + stackTrace` combinations only call the API once per run, no matter how many retries Playwright executes.
- **Model tiering** — short stack traces use the cheaper Haiku model; longer ones escalate to Sonnet.
- **Hard timeout** — each LLM call is capped at 10 seconds. Failures fall back gracefully without crashing the suite.

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Install Playwright browsers

```bash
npx playwright install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Then edit `.env` and fill in your values (see [Environment Variables](#environment-variables)).

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `BASE_URL` | Yes | Base URL for UI tests (e.g. `http://localhost:3000`) |
| `API_BASE_URL` | Yes | Base URL for API tests (e.g. `http://localhost:3000/api`) |
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key — get one at [console.anthropic.com](https://console.anthropic.com) |

> The `.env` file is git-ignored. Never commit real secrets.

---

## Running Tests

```bash
# Run all tests (headless)
npm test

# Run tests in headed mode (browser visible)
npm run test:headed

# Run a specific spec file
npx playwright test tests/smoke.spec.ts

# Open the HTML test report in browser
npm run test:report
```

---

## Reports

| Report | Location | Description |
|---|---|---|
| AI failure analysis | `reports/ai-failure-report.json` | Claude-generated explanations for every failed test |
| HTML report | `reports/playwright-report/` | Standard Playwright HTML report |
| Traces | `reports/test-results/` | Playwright traces (retained on failure) |
| Screenshots | `reports/test-results/` | Screenshots (captured on failure only) |

---

## Path Aliases

TypeScript path aliases are configured in `tsconfig.json` for cleaner imports:

```typescript
import { SamplePage }      from "@pages/BasePage";
import { sampleGetRequest } from "@api/BaseApi";
import { getEnv }           from "@utils/env.helper";
import { failureCache }     from "@core/failureCache";
```

---

## CI Behaviour

The `playwright.config.ts` adjusts automatically when `CI=true` is set:

| Setting | Local | CI |
|---|---|---|
| Retries | 0 | 2 |
| Workers | Auto (CPU-based) | 1 (sequential) |
| `forbidOnly` | false | true |
