import Anthropic from "@anthropic-ai/sdk";
import * as dotenv from "dotenv";

dotenv.config({ override: true });

export interface FailureExplanation {
  root_cause: string;
  likely_reason: string;
  suggested_fix: string;
  confidence: "Low" | "Medium" | "High";
}

const SYSTEM_PROMPT = `You are a test failure analysis expert.
Given a test failure payload, respond with a JSON object only — no prose, no markdown, no code fences.
The JSON must conform exactly to this structure:
{
  "root_cause": "string",
  "likely_reason": "string",
  "suggested_fix": "string",
  "confidence": "Low" | "Medium" | "High"
}`;

const TIMEOUT_MS = 10_000;
const MAX_RETRIES = 2;

function selectModel(stackTrace: string): string {
  return stackTrace.length < 800
    ? "claude-3-haiku-20240307"
    : "claude-3-sonnet-20240229";
}

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error(`LLM request timed out after ${ms}ms`)), ms)
  );
  return Promise.race([promise, timeout]);
}

function extractJson(raw: string): string {
  const trimmed = raw.trim();
  const match = trimmed.match(/\{[\s\S]*\}/);
  if (!match) {
    throw new Error("No JSON object found in LLM response");
  }
  return match[0];
}

function extractText(response: Anthropic.Message): string {
  return response.content
    .filter((block: Anthropic.ContentBlock): block is Anthropic.TextBlock => block.type === "text")
    .map((block: Anthropic.TextBlock) => block.text)
    .join("");
}

function validateShape(parsed: unknown): FailureExplanation {
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    typeof (parsed as Record<string, unknown>).root_cause !== "string" ||
    typeof (parsed as Record<string, unknown>).likely_reason !== "string" ||
    typeof (parsed as Record<string, unknown>).suggested_fix !== "string" ||
    !["Low", "Medium", "High"].includes(
      (parsed as Record<string, unknown>).confidence as string
    )
  ) {
    throw new Error("LLM response does not match FailureExplanation schema");
  }
  return parsed as FailureExplanation;
}

export class LLMClient {
  private readonly client: Anthropic;

  constructor() {
    if (!process.env.ANTHROPIC_API_KEY) {
      throw new Error("ANTHROPIC_API_KEY is not set in environment");
    }
    this.client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }

  async explainFailure(payload: {
    failure: { stackTrace: string; [key: string]: unknown };
    [key: string]: unknown;
  }): Promise<FailureExplanation> {
    const model = selectModel(payload.failure.stackTrace);
    const userContent = JSON.stringify(payload, null, 2);

    let lastError: unknown;

    for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
      try {
        const response = await withTimeout(
          this.client.messages.create({
            model,
            max_tokens: 512,
            system: SYSTEM_PROMPT,
            messages: [{ role: "user", content: userContent }],
          }),
          TIMEOUT_MS
        );

        const raw = extractText(response);
        const cleaned = extractJson(raw);
        const parsed: unknown = JSON.parse(cleaned);

        return validateShape(parsed);
      } catch (err) {
        lastError = err;
      }
    }

    throw new Error(
      `explainFailure failed after ${MAX_RETRIES + 1} attempts: ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`
    );
  }
}
