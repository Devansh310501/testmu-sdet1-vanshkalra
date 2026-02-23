# AI Usage Log – TestMu SDET-1 Hackathon Submission

This document transparently logs all AI tools used during the development of this project, along with their purpose and the level of human oversight applied.

The goal was not to replace engineering decisions with AI, but to use AI as a structured accelerator while maintaining architectural ownership.

---

## 1️⃣ Antigravity (Claude Opus 4.6)

**Used For:**
- Initial Playwright + TypeScript scaffolding
- Base folder structure generation
- Initial configuration boilerplate

**AI Contribution:**
- Generated initial folder layout and starter files.

**Human Intervention:**
- Reviewed and refined structure.
- Renamed placeholder files to align with scalable SDET architecture.
- Ensured separation of concerns (`core`, `pages`, `api`, `utils`).
- Verified configuration correctness manually.

---

## 2️⃣ Claude (Anthropic API – Real Integration)

**Used For:**
- Task 2: Structured regression test case generation (Login, Dashboard, REST API).
- Task 3: Real-time failure explanation via API integration inside test execution.

**AI Contribution (Task 2):**
- Generated structured JSON test cases.
- Provided coverage across UI, API, concurrency, security, and schema validation.

**Human Intervention (Task 2):**
- Refined prompts to separate UI and API concerns.
- Removed infrastructure-only scenarios.
- Enforced strict JSON output schema.
- Validated automation feasibility of generated scenarios.

**AI Contribution (Task 3 – Live API Calls):**
- Analyzed structured failure payloads.
- Returned deterministic JSON explanations:
  - root_cause
  - likely_reason
  - suggested_fix
  - confidence

**Human Engineering Decisions (Task 3):**
- Designed structured failure payload format.
- Implemented SHA-256 hash-based failure caching.
- Added tier-based model selection for cost optimization.
- Added retry logic (2 attempts).
- Added 10-second timeout guard.
- Enforced JSON schema validation to prevent malformed responses.
- Implemented safe fallback behavior to avoid test suite crashes.

All LLM calls are real API calls using the Anthropic SDK and are triggered during test execution via a custom Playwright reporter.

---

## 3️⃣ ChatGPT (Architectural Reasoning & Review)

**Used For:**
- High-level architectural validation
- Reporter integration strategy discussion
- SaaS-level design refinement
- Structured documentation assistance

**Human Oversight:**
- All architectural decisions (caching, retry, timeout, tiering, reporter lifecycle integration) were manually reviewed and validated before implementation.
- No code was copied blindly; all generated code was inspected, refactored where necessary, and hardened for reliability.

---

## 4️⃣ Kimi K2 (Cross-Validation & Sanity Checks)

**Used For:**
- Independent validation of architectural decisions
- Cross-checking failure handling logic
- Verifying robustness of retry and timeout patterns
- Reviewing structured payload and schema enforcement

**Purpose:**
To reduce confirmation bias and ensure that the final implementation reflects sound engineering practices rather than single-model suggestions.

---

# AI Usage Philosophy

AI was used as:

- A structured accelerator for test design.
- A reasoning engine integrated directly into the automation framework.
- A system-level component (not a chatbot add-on).

All core architectural decisions — including caching strategy, tiered model selection, structured payload enforcement, retry/timeout safety, and reporter lifecycle integration — were manually designed and implemented.

The system demonstrates controlled, transparent, and production-oriented AI integration rather than passive code generation.