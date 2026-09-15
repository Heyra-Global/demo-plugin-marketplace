---
name: pr-description
description:
  Write a pull request title and description from the commits and the diff of
  the current branch against its base branch. Use when the user asks for a PR
  description or PR body, or is about to open a pull request. For the commits
  themselves see commit, and for a review before opening the PR see
  review-changes.
argument-hint: "[base-branch, default origin/main]"
disable-model-invocation: true
allowed-tools: Bash(git log:*), Bash(git diff:*), Bash(git rev-parse:*), Bash(git branch:*)
---

# Pull request description

Base branch: `$ARGUMENTS` (empty means `origin/main`).

## Live branch data

Current branch: !`git rev-parse --abbrev-ref HEAD 2>/dev/null`

Commits on this branch:

```
!`git log --oneline origin/main..HEAD 2>/dev/null || git log --oneline -15`
```

Files changed:

```
!`git diff --stat origin/main...HEAD 2>/dev/null | tail -25`
```

## Steps

1. If the user gave a different base branch, re-run the two commands above
   with it.
2. Read the full diff (`git diff origin/main...HEAD`) when the stat is under
   ~800 lines; otherwise read the diff per directory and the commit bodies.
3. Write the description with this template. Keep it under 300 words.

```markdown
## Title
<type(scope): summary, under 70 characters>

## Why
<One to three sentences. The problem or the goal. Link the issue if one is
named in the commits.>

## What changed
- <bullet per meaningful change, in the order a reviewer should read them>

## How to test
1. <command or click path>
2. <expected result>

## Risks and follow-ups
- <what could break, what is deliberately left out>
```

4. Reply with the Markdown only, ready to paste into GitHub. If the `gh` CLI
   is available and the user asks, offer the exact `gh pr create` command;
   do not run it without being asked.
