import { failureCache } from "./failureCache";
import { LLMClient, type FailureExplanation } from "./llmClient";

const FALLBACK_EXPLANATION: FailureExplanation = {
  root_cause: "Unable to determine root cause",
  likely_reason: "LLM analysis failed",
  suggested_fix: "Review stack trace and test logs manually",
  confidence: "Low",
};

interface ProcessFailureInput {
  testTitle: string;
  file: string;
  errorMessage: string;
  stackTrace: string;
  expected?: string;
  actual?: string;
  url?: string;
  browserName?: string;
  screenshotPath?: string;
  tracePath?: string;
  consoleErrors?: string[];
  networkFailures?: string[];
}

interface FailurePayload {
  metadata: { timestamp: string };
  test: { title: string; file: string };
  failure: {
    errorMessage: string;
    stackTrace: string;
    expected: string | null;
    actual: string | null;
    [key: string]: unknown;
  };
  browserContext: { url: string | null; browserName: string | null };
  artifacts: {
    screenshotPath: string | null;
    tracePath: string | null;
    consoleErrors: string[];
    networkFailures: string[];
  };
  [key: string]: unknown;
}

function buildPayload(input: ProcessFailureInput): FailurePayload {
  return {
    metadata: {
      timestamp: new Date().toISOString(),
    },
    test: {
      title: input.testTitle,
      file: input.file,
    },
    failure: {
      errorMessage: input.errorMessage,
      stackTrace: input.stackTrace,
      expected: input.expected ?? null,
      actual: input.actual ?? null,
    },
    browserContext: {
      url: input.url ?? null,
      browserName: input.browserName ?? null,
    },
    artifacts: {
      screenshotPath: input.screenshotPath ?? null,
      tracePath: input.tracePath ?? null,
      consoleErrors: input.consoleErrors ?? [],
      networkFailures: input.networkFailures ?? [],
    },
  };
}

export class FailureExplainer {
  private readonly llmClient: LLMClient;

  constructor(llmClient: LLMClient) {
    this.llmClient = llmClient;
  }

  async processFailure(
    input: ProcessFailureInput,
  ): Promise<FailureExplanation> {
    const hash = failureCache.generateHash(
      input.errorMessage,
      input.stackTrace,
    );

    if (failureCache.has(hash)) {
      const cached = failureCache.get(hash);
      if (cached) return cached;
    }

    try {
      const payload = buildPayload(input);
      const explanation = await this.llmClient.explainFailure(payload);
      failureCache.set(hash, explanation);
      return explanation;
    } catch {
      return FALLBACK_EXPLANATION;
    }
  }
}
