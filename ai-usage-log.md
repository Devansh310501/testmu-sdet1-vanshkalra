# AI Usage Log – TestMu SDET-1 Hackathon

This document logs every AI tool used during the development of this project, along with the purpose and level of human intervention.

---

## 1. Antigravity (Claude Opus 4.6)

**Used For:**
- Initial Playwright + TypeScript project scaffolding
- Base folder structure generation
- Playwright configuration boilerplate

**AI Contribution:**
- Generated initial project structure and minimal setup files.

**Human Intervention:**
- Reviewed and refined folder naming.
- Renamed placeholder files to align with scalable SDET architecture.
- Adjusted structure to clearly separate `core`, `pages`, `api`, and `utils`.

---

## 2. Claude (Terminal Access)

**Used For:**
- Prompt engineering and structured test case generation for:
  - Login module
  - Dashboard module
  - REST API module

**AI Contribution:**
- Generated structured JSON regression test cases.
- Provided separation of UI vs API-level tests.
- Produced concurrency and security edge case coverage.

**Human Intervention:**
- Iteratively refined prompts to improve separation of concerns.
- Removed infrastructure-level checks where inappropriate.
- Enforced consistent JSON schema structure.
- Reviewed output for automation feasibility.

---

## AI Usage Philosophy

AI was used as a structured acceleration tool for test case generation and scaffolding, while architectural decisions, refinement, and validation were performed manually to ensure scalability, realism, and alignment with SDET best practices.