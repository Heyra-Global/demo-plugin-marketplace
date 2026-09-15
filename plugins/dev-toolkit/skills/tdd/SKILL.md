---
name: tdd
description:
  Test-driven development workflow - write the failing test first, make it
  pass with the smallest change, then refactor - with rules for choosing the
  test level, naming tests and not mocking the unit under test. Use when
  adding a feature or fixing a bug in a codebase that has tests, or when the
  user mentions TDD, "tests first", or asks how to test something. For the
  commit afterwards see commit, and for a review see review-changes.
---

# Test-driven development

Claude loads this skill on its own when the task calls for it. Nothing here
is user-only.

## The loop

1. **Red.** Write one test that describes the next behaviour. Run it. It must
   fail for the right reason (an assertion, not an import error).
2. **Green.** Make the smallest change that passes. Ugly is fine.
3. **Refactor.** Clean up with the tests green. Run them again.
4. Repeat. Commit after each green-refactor pair (`/dev-toolkit:commit`).

Bug fix variant: first write the test that reproduces the bug and watch it
fail, then fix.

## Which test level

| Situation                                  | Level                | Why                          |
| ------------------------------------------ | -------------------- | ---------------------------- |
| Pure function or small class               | Unit                 | Fast, precise                |
| Code that talks to a database or API        | Integration with a real local instance or recorded responses | Mocks hide the real failure  |
| User-visible flow                          | One end-to-end test  | Expensive; keep it to a few  |

## Rules

- One behaviour per test. Name it after the behaviour:
  `test_rejects_negative_amount`.
- Arrange, act, assert. Three visible blocks, no logic in tests.
- Never mock the unit under test. Mock I/O at the boundary only.
- No sleeps, no real clocks, no network in unit tests.
- A test that has never failed proves nothing. Watch it fail once.

## Find the runner

```
!`ls pytest.ini pyproject.toml package.json vitest.config.* jest.config.* go.mod Cargo.toml *.csproj 2>/dev/null | sed 's/^/  - /' || echo "  (no known test runner config found)"`
```

| Config found            | Run                              |
| ----------------------- | -------------------------------- |
| pytest.ini / pyproject  | `pytest -x -q`                   |
| package.json (vitest)   | `npx vitest run`                 |
| package.json (jest)     | `npx jest`                       |
| go.mod                  | `go test ./...`                  |
| Cargo.toml              | `cargo test`                     |
| *.csproj                | `dotnet test`                    |

Delegate large test-writing jobs to the `test-writer` subagent; it has this
skill preloaded.
