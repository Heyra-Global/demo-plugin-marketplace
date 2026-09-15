# dev-toolkit

General coding productivity plugin: the everyday commands a team wants in
every repository, plus guard rails, language servers and documentation MCP
servers. Install it at user scope so it is present everywhere.

## What is in it

| Component                          | Where                              | What it shows                                                                        |
| ---------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| Skill with pre-approved tools      | `skills/commit/`                   | `allowed-tools: Bash(git add:*), ...` so the commit runs without permission prompts    |
| Skill with live git data           | `skills/pr-description/`           | `` !`git log origin/main..HEAD` `` injected at load time                              |
| Skill forked into a subagent       | `skills/review-changes/`           | `context: fork` + `agent: code-reviewer`                                              |
| Skill Claude loads on its own      | `skills/tdd/`                      | No `disable-model-invocation`; the description is the trigger                        |
| Diagnostic skill                   | `skills/doctor/`                   | A table of `` !`tool --version` `` checks, mirrors the doctor command in Heyra's real marketplace |
| Onboarding skill                   | `skills/setup/`                    | Detects the stack and installs plugins at project scope; writes `extraKnownMarketplaces` |
| Subagent (read-only, high effort)  | `agents/code-reviewer.md`          | `disallowedTools: Write, Edit`, `effort: high`                                        |
| Subagent (writes code)             | `agents/test-writer.md`            | Preloads the tdd skill with `skills:`                                                  |
| Hook: PreToolUse in **bash**       | `hooks/guard-destructive.sh`       | Hooks are language-agnostic. Denies force-push to main, asks on `rm -rf` and `git reset --hard` |
| Hook: SessionStart with matcher    | `hooks/git-context.sh`             | `matcher: startup|resume` so it does not fire on `/clear` or compaction              |
| Hook: PostToolUse                  | `hooks/auto-format.js`             | Runs ruff or prettier when the project has them configured                           |
| Hook: Stop, type **prompt**        | `hooks/hooks.json`                 | No script at all: a small model decides whether tests were run before Claude stops   |
| LSP servers                        | `.lsp.json`                        | Pyright and typescript-language-server give Claude diagnostics as it edits           |
| MCP servers (public)               | `.mcp.json`                        | Context7 over HTTP (docs lookup) and Playwright over stdio via `npx`                  |

## Try it

```text
/plugin install dev-toolkit@heyra-demo
```

Then:

```text
/dev-toolkit:setup
/dev-toolkit:doctor
/dev-toolkit:commit --all
/dev-toolkit:pr-description
/dev-toolkit:review-changes --staged
Run: git push --force origin main          (the guard hook denies it)
Edit a .py file, then try to stop           (the Stop hook asks for a test run)
```

## Prerequisites

- git, Node.js 18+ (auto-format hook), bash (Git Bash on Windows)
- Optional: `ruff`, a prettier config, `npm i -g pyright typescript-language-server typescript`
- Optional: a `CONTEXT7_API_KEY` for higher Context7 rate limits
