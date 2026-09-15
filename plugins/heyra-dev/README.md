# heyra-dev

The developer plugin. It exists to show one thing: the same plugin folder
installs in **Claude Code**, **GitHub Copilot CLI**, **VS Code with
Copilot** and the **Copilot cloud agent**, because the plugin ships two
manifests and the marketplace file sits in both locations the tools look
at.

## Two formats, one folder

| File                                   | Read by                                                   |
| -------------------------------------- | --------------------------------------------------------- |
| `.claude-plugin/plugin.json`           | Claude Code, Claude Cowork, Copilot CLI (legacy discovery) |
| `plugin.json` (Agent Plugins 1.0)      | Copilot CLI, VS Code, Copilot app, other Agent Plugins clients |
| `.mcp.json`                            | Claude Code (Claude format)                                |
| `mcp.json`                             | Agent Plugins clients                                      |
| `agents/*.md`                          | Claude Code subagents                                      |
| `com.github.copilot/agents/*.agent.md` | Copilot custom agents                                      |
| `hooks/hooks.json` (PascalCase events) | Claude Code; also accepted by Copilot CLI and VS Code       |
| `skills/*/SKILL.md`                    | Everything. Skills are the shared Agent Skills standard     |
| `.lsp.json`                            | Claude Code, Copilot CLI (legacy `lspServers`)              |

## What is in it

| Component                          | Where                                       | What it shows                                                              |
| ---------------------------------- | ------------------------------------------- | -------------------------------------------------------------------------- |
| Skill with pre-approved tools      | `skills/commit/`                            | `allowed-tools: Bash(git add:*), ...`: the commit runs without prompts      |
| Skill with live git data           | `skills/pr-description/`                    | `` !`git log origin/main..HEAD` `` injected at load time                   |
| Skill forked into a subagent       | `skills/review-changes/`                    | `context: fork` + `agent: code-reviewer`                                   |
| Skill Claude loads on its own      | `skills/tdd/`                               | The description is the trigger                                             |
| Diagnostic skill                   | `skills/doctor/`                            | A table of `` !`tool --version` `` checks                                  |
| Onboarding skill                   | `skills/setup/`                             | Registers the marketplace for Claude Code and Copilot in committed settings |
| Subagents, Claude format           | `agents/code-reviewer.md`, `agents/test-writer.md` | `disallowedTools`, `effort`, `skills:` preloading                   |
| Subagents, Copilot format          | `com.github.copilot/agents/*.agent.md`      | Same prompts, Copilot tool aliases                                         |
| Hook: PreToolUse in bash           | `hooks/guard-destructive.sh`                | Denies force-push to main, asks on `rm -rf` and `git reset --hard`         |
| Hook: SessionStart with matcher    | `hooks/git-context.sh`                      | `matcher: startup|resume`                                                  |
| Hook: PostToolUse                  | `hooks/auto-format.js`                      | Runs ruff or prettier when the project has them                            |
| Hook: Stop, type prompt            | `hooks/hooks.json`                          | No script: a small model checks that tests were run                        |
| LSP servers                        | `.lsp.json`                                 | Pyright and typescript-language-server                                     |
| MCP servers                        | `.mcp.json`, `mcp.json`                     | Context7 over HTTP, Playwright over stdio                                  |

## Install

Claude Code:

```bash
claude plugin marketplace add Heyra-Global/demo-plugin-marketplace
claude plugin install heyra-dev@heyra-demo --scope user
```

GitHub Copilot CLI:

```bash
copilot plugin marketplace add Heyra-Global/demo-plugin-marketplace
copilot plugin install heyra-dev@heyra-demo
```

VS Code with Copilot: add `"Heyra-Global/demo-plugin-marketplace"` to the
`chat.plugins.marketplaces` setting, or commit
`.github/copilot/settings.json` in the repository (this repo has one).

Copilot cloud agent: `.github/copilot/settings.json` with
`extraKnownMarketplaces` and `enabledPlugins`, as in this repository.

Copilot Business and Enterprise admins: `copilot/managed-settings.json`
in the organisation's `.github-private` repository, with the same two keys.

## Try it

```text
/heyra-dev:setup
/heyra-dev:doctor
/heyra-dev:commit --all
/heyra-dev:pr-description
/heyra-dev:review-changes --staged
Run: git push --force origin main          (the guard hook denies it)
```

## Prerequisites

git, bash (Git Bash on Windows), Node.js 18+ for the auto-format hook.
Optional: ruff, a prettier config, `npm i -g pyright typescript-language-server typescript`.
