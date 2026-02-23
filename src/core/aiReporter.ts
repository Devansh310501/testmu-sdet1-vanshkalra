import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import type {
  Reporter,
  TestCase,
  TestResult,
  FullResult,
} from "@playwright/test/reporter";
import { LLMClient, type FailureExplanation } from "./llmClient";
import { FailureExplainer } from "./failureExplainer";

const REPORTS_DIR = "reports";
const REPORT_PATH = path.join(REPORTS_DIR, "ai-failure-report.json");

interface ReportEntry {
  testTitle: string;
  file: string;
  retry: number;
  errorMessage: string;
  explanation: FailureExplanation;
}

class AIReporter implements Reporter {
  private readonly explainer: FailureExplainer;
  private readonly pending: Promise<void>[] = [];
  private readonly entries: ReportEntry[] = [];

  constructor() {
    const llmClient = new LLMClient();
    this.explainer = new FailureExplainer(llmClient);
  }

  onTestEnd(test: TestCase, result: TestResult): void {
    if (result.status !== "failed" && result.status !== "timedOut") {
      return;
    }

    const errorMessage = result.error?.message ?? "Unknown error";
    const stackTrace = result.error?.stack ?? "";

    const screenshotPath = result.attachments.find(
      (a) => a.name === "screenshot" && typeof a.path === "string"
    )?.path;

    const tracePath = result.attachments.find(
      (a) => a.name === "trace" && typeof a.path === "string"
    )?.path;

    const task = this.explainer
      .processFailure({
        testTitle: test.title,
        file: test.location.file,
        errorMessage,
        stackTrace,
        screenshotPath,
        tracePath,
      })
      .then((explanation) => {
        this.entries.push({
          testTitle: test.title,
          file: test.location.file,
          retry: result.retry,
          errorMessage,
          explanation,
        });
      })
      .catch(() => {});

    this.pending.push(task);
  }

  async onEnd(_result: FullResult): Promise<void> {
    try {
      await Promise.allSettled(this.pending);
      await fs.promises.mkdir(REPORTS_DIR, { recursive: true });
      await fs.promises.writeFile(REPORT_PATH, JSON.stringify(this.entries, null, 2), "utf-8");
    } catch {
      // intentionally silent
    }
  }
}

export default AIReporter;
