import { test, expect, request } from "@playwright/test";

/**
 * Smoke suite — runs against https://playwright.dev (public, always available).
 *
 * Structure:
 *  ✅  Passing tests  — prove the framework works normally.
 *  ❌  Intentional failures — exercise the AI failure analysis pipeline with
 *      distinct error types so the reporter produces varied, meaningful output.
 */

// ---------------------------------------------------------------------------
// ✅  PASSING — UI
// ---------------------------------------------------------------------------

test.describe("UI – Passing", () => {
  test("page title contains 'Playwright'", async ({ page }) => {
    await page.goto("https://playwright.dev");
    await expect(page).toHaveTitle(/Playwright/);
  });

  test("main heading is visible on landing page", async ({ page }) => {
    await page.goto("https://playwright.dev");
    const heading = page.getByRole("heading", { name: /playwright/i }).first();
    await expect(heading).toBeVisible();
  });

  test("'Get started' link is present and navigates to docs", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev");
    const link = page.getByRole("link", { name: /get started/i }).first();
    await expect(link).toBeVisible();
    await link.click();
    await expect(page).toHaveURL(/intro/);
  });

  test("search button is present in navigation", async ({ page }) => {
    await page.goto("https://playwright.dev");
    const searchBtn = page.getByRole("button", { name: /search/i }).first();
    await expect(searchBtn).toBeVisible();
  });
});

// ---------------------------------------------------------------------------
// ✅  PASSING — API
// ---------------------------------------------------------------------------

test.describe("API – Passing", () => {
  test("GET https://playwright.dev returns HTTP 200", async () => {
    const ctx = await request.newContext();
    const response = await ctx.get("https://playwright.dev");
    expect(response.status()).toBe(200);
    await ctx.dispose();
  });

  test("response Content-Type is HTML", async () => {
    const ctx = await request.newContext();
    const response = await ctx.get("https://playwright.dev");
    expect(response.headers()["content-type"]).toContain("text/html");
    await ctx.dispose();
  });
});

// ---------------------------------------------------------------------------
// ❌  INTENTIONAL FAILURES — each produces a distinct error type so the AI
//     reporter receives varied payloads and returns different explanations.
// ---------------------------------------------------------------------------

test.describe("AI Pipeline – Intentional Failures", () => {
  /**
   * Failure type: assertion mismatch (value comparison).
   * Short stack trace → Haiku model selected.
   */
  test("FAIL – wrong page title assertion triggers AI analysis", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev");
    // Intentionally wrong: real title is "Playwright", not "Selenium"
    await expect(page).toHaveTitle("Selenium", { timeout: 3000 });
  });

  /**
   * Failure type: element not found (missing selector).
   * Short stack trace → Haiku model selected.
   */
  test("FAIL – non-existent button selector triggers AI analysis", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev");
    // Intentionally wrong: no such button exists on the page
    await expect(
      page.getByRole("button", { name: "Download Legacy Version" })
    ).toBeVisible({ timeout: 3000 });
  });

  /**
   * Failure type: text content mismatch.
   * Short stack trace → Haiku model selected.
   */
  test("FAIL – incorrect text content assertion triggers AI analysis", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev");
    const heading = page.getByRole("heading").first();
    // Intentionally wrong expected text
    await expect(heading).toHaveText("Welcome to Selenium Framework", {
      timeout: 3000,
    });
  });

  /**
   * Failure type: URL mismatch after navigation.
   * Produces a longer error message to exercise Sonnet model path when
   * combined with a verbose stack trace from nested async frames.
   */
  test("FAIL – unexpected URL after navigation triggers AI analysis", async ({
    page,
  }) => {
    await page.goto("https://playwright.dev");
    await page.getByRole("link", { name: /get started/i }).first().click();
    await page.waitForURL(/intro/, { timeout: 5000 });
    // Intentionally wrong: we are on /intro, asserting it is /api-reference
    expect(page.url()).toBe("https://playwright.dev/docs/api/class-page");
  });

  /**
   * Failure type: API wrong status code assertion.
   * Pure API failure — no browser involved.
   */
  test("FAIL – API status code mismatch triggers AI analysis", async () => {
    const ctx = await request.newContext();
    const response = await ctx.get("https://playwright.dev");
    // Intentionally wrong: asserting 404 on a page that returns 200
    expect(response.status()).toBe(404);
    await ctx.dispose();
  });
});
