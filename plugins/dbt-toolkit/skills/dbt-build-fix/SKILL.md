---
name: dbt-build-fix
description:
  Run dbt build (or a selection) and fix failures in a loop until the build
  is green, inside the dbt-runner subagent so the long dbt output stays out
  of the main conversation. Use when the user asks to build, test, or "make
  dbt pass". For the rules see dbt-conventions, for a coverage report see
  dbt-test-coverage.
argument-hint: "[--select <selector>] [--target dev]"
disable-model-invocation: true
context: fork
agent: dbt-runner
---

Build this dbt project and fix what fails.

Arguments: `$ARGUMENTS`

- Use the selector from the arguments if present, otherwise the whole
  project.
- Use the `dev` target unless another non-production target is given. Never
  target prod; the guard hook blocks it.
- Follow the loop in your system prompt. Stop and report when you hit a data
  problem that code cannot fix.

Return the final report in the format your system prompt defines.
