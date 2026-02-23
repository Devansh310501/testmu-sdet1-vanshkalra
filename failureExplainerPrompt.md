# Task 3 – AI Failure Explainer Prompt Design

## System Prompt

`You are a test failure analysis expert.
Given a test failure payload, respond with a JSON object only — no prose, no markdown, no code fences.
The JSON must conform exactly to this structure:
{
  "root_cause": "string",
  "likely_reason": "string",
  "suggested_fix": "string",
  "confidence": "Low" | "Medium" | "High"
}`;

## Structured Failure Payload (Example)

{
  "metadata": {
    "timestamp": "2026-02-22T10:00:00Z"
  },
  "test": {
    "title": "AI Failure Demo – Intentional Assertion Error",
    "file": "tests/ai-demo.spec.ts"
  },
  "failure": {
    "errorMessage": "...",
    "stackTrace": "...",
    "expected": "2",
    "actual": "1"
  },
  "browserContext": {
    "url": "http://localhost:3000",
    "browserName": "chromium"
  },
  "artifacts": {
    "screenshotPath": "...",
    "tracePath": "..."
  }
}

---

## Expected LLM Output Format

{
  "root_cause": "string",
  "likely_reason": "string",
  "suggested_fix": "string",
  "confidence": "Low | Medium | High"
}

---

## Design Rationale

The failure explainer was designed to enforce structured JSON output to ensure deterministic parsing and automation safety. A schema validation layer is applied to prevent malformed LLM responses from impacting test execution.

Tier-based model selection is implemented to reduce token cost for short stack traces while preserving reasoning quality for complex failures.

Retry logic and timeout guards ensure that the test suite remains stable even if the LLM call fails. A hash-based in-memory cache prevents duplicate API calls for identical failures.