---
name: review-changes
description:
  Review the uncommitted changes, the staged changes, or the current branch
  against a base branch for bugs, missing tests and simplifications, in an
  isolated code-reviewer subagent so the diff does not fill the main
  conversation. Use when the user asks for a code review of their work before
  committing or opening a pull request. For the commit see commit, and for
  writing the missing tests see tdd.
argument-hint: "[--staged | <base-branch>]"
context: fork
agent: code-reviewer
---

Review the code changes in this repository.

Scope from the arguments: `$ARGUMENTS`

- `--staged`: review `git diff --staged` only.
- A branch name: review `git diff <branch>...HEAD`.
- Nothing: review `git diff` and `git diff --staged` together.

Follow the process in your system prompt and return the report in its
format. Do not edit any file.
