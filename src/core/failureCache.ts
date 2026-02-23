import { createHash } from "crypto";

export interface FailureExplanation {
  root_cause: string;
  likely_reason: string;
  suggested_fix: string;
  confidence: "Low" | "Medium" | "High";
}

class FailureCache {
  private readonly cache: Map<string, FailureExplanation> = new Map();

  generateHash(errorMessage: string, stackTrace: string): string {
    return createHash("sha256")
      .update(`${errorMessage}::${stackTrace}`)
      .digest("hex");
  }

  get(hash: string): FailureExplanation | undefined {
    return this.cache.get(hash);
  }

  set(hash: string, explanation: FailureExplanation): void {
    this.cache.set(hash, explanation);
  }

  has(hash: string): boolean {
    return this.cache.has(hash);
  }
}

export const failureCache = new FailureCache();
