---
name: andrej-karpathy-skills
description: >-
  Behavioral guidelines derived from Andrej Karpathy to eliminate common LLM coding pitfalls. Enforces Think Before Coding, Simplicity First, Surgical Changes, and Goal-Driven Execution. Use for all engineering tasks, code modifications, debugging, and refactoring across all projects.
---

# Karpathy-Inspired Coding Guidelines

Behavioral guidelines to reduce common LLM coding mistakes, derived from Andrej Karpathy's observations on LLM coding pitfalls.

## Core Philosophy
> "The models make wrong assumptions on your behalf and just run along with them without checking. They don't manage their confusion, don't seek clarifications, don't surface inconsistencies, don't present tradeoffs, don't push back when they should."
> "They really like to overcomplicate code and APIs, bloat abstractions, don't clean up dead code... implement a bloated construction over 1000 lines when 100 would do."
> "They still sometimes change/remove comments and code they don't sufficiently understand as side effects, even if orthogonal to the task."

---

## 1. Think Before Coding
**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- **State assumptions explicitly** — If uncertain, ask rather than guess.
- **Present multiple interpretations** — Don't pick silently when ambiguity exists.
- **Push back when warranted** — If a simpler approach exists, say so.
- **Stop when confused** — Name what's unclear and ask for clarification.

---

## 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

Combat the tendency toward overengineering:
- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If 200 lines could be 50, rewrite it.

**The Test:** Would a senior engineer say this is overcomplicated? If yes, simplify.

---

## 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it without asking.

When changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

**The Test:** Every changed line must trace directly to the user's explicit request.

---

## 4. Goal-Driven Execution
**Define success criteria. Loop until verified.**

Transform imperative tasks into verifiable goals:
- For bugs: verify reproduction, then verify fix.
- For features: state brief verification steps before and after executing.
- Test and verify thoroughly before claiming completion.

| Instead of... | Transform to... |
| :--- | :--- |
| "Add validation" | "Write validation for invalid inputs, verify it blocks bad data" |
| "Fix the bug" | "Reproduce bug, apply fix, verify bug is gone without side effects" |
| "Refactor X" | "Ensure behavior and tests pass identically before and after" |
