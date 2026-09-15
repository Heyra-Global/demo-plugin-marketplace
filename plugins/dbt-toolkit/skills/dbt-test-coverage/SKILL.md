---
name: dbt-test-coverage
description:
  Report which dbt models have tests, which have none, and propose the tests
  to add. Runs a bundled script at load time so the numbers are real, not
  guessed. Use when the user asks about test coverage, missing tests, or
  wants to harden a dbt project. For the rules see dbt-conventions, to add a
  model see dbt-new-model, and to run tests see dbt-build-fix.
argument-hint: "[--fix]"
---

# dbt test coverage

## Live report

The table below was produced when this skill loaded, by
`scripts/test_coverage.py` from the plugin (standard library Python, no dbt
needed):

```
!`python3 "${CLAUDE_SKILL_DIR}/../../scripts/test_coverage.py" 2>/dev/null || python "${CLAUDE_SKILL_DIR}/../../scripts/test_coverage.py" 2>&1`
```

## What to do with it

1. Summarise the coverage number in one sentence.
2. For every model without tests, propose the minimum set from the
   dbt-conventions skill: `unique` + `not_null` on the key, `relationships`
   on foreign keys, `accepted_values` on status columns. Read the model to
   find the key; do not guess.
3. If the user passed `--fix` (arguments: `$ARGUMENTS`), write the proposed
   entries into the `.yml` file next to each model. Otherwise, show the YAML
   and stop.
4. End with the command to run the new tests: `dbt test --select <models>`.
