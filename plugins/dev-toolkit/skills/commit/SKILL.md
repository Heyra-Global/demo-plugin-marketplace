---
name: commit
description:
  Create a conventional commit from the staged changes, or stage everything
  first when nothing is staged, with a subject under 72 characters and a body
  that explains why. Use when the user says commit, save my work, or asks for
  a commit message. For a pull request description see pr-description, and
  for a review before committing see review-changes.
argument-hint: "[hint about the change] [--all]"
disable-model-invocation: true
allowed-tools: Bash(git add:*), Bash(git commit:*), Bash(git status:*), Bash(git diff:*), Bash(git log:*)
---

# Commit

Hint from the user: `$ARGUMENTS`

The `allowed-tools` field pre-approves the git commands this skill needs, so
the commit happens without a permission prompt. Nothing else is pre-approved.

## Live repository state

Status:

```
!`git status --short 2>/dev/null || echo "not a git repository"`
```

Staged diff (stat):

```
!`git diff --staged --stat 2>/dev/null`
```

Recent subjects (match their style):

```
!`git log --oneline -8 2>/dev/null`
```

## Steps

1. If nothing is staged and the user passed `--all`, run `git add -A`. If
   nothing is staged and there is no `--all`, ask one question: stage
   everything, or stop so the user can stage by hand.
2. Read the staged diff (`git diff --staged`) and identify the one change it
   represents. If it is clearly two unrelated changes, say so and propose a
   split; do not commit a mixed change.
3. Write the message:
   - Subject: `type(scope): imperative summary`, under 72 characters, no
     trailing period. Types: feat, fix, refactor, docs, test, chore, perf,
     ci.
   - Blank line, then a body that explains **why**, not what. Two to five
     lines. Skip the body for trivial changes.
   - Never write "update", "changes", "wip" or "fix bug" as the subject.
4. Commit with `git commit -m "<subject>" -m "<body>"`.
5. Reply with the commit hash and subject only.

## Never

- Amend a published commit.
- Skip hooks (`--no-verify`).
- Add files that look like secrets (`.env`, `*.pem`, `id_rsa`). Warn instead.
