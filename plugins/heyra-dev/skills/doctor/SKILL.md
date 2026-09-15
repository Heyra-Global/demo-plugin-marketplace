---
name: doctor
description:
  Check the local machine for the tools the heyra-dev plugin needs - git,
  Node, Python, jq, language servers, Claude Code, GitHub Copilot CLI - plus
  the installed plugins and MCP servers, and report what is missing with
  the install command. Use when a hook or MCP server fails, a skill does
  not load, or the user asks "is my setup ok". For first-time project setup
  see setup.
disable-model-invocation: true
---

# Doctor

Every line below is filled in when the skill loads, by running the command
inline. Read them, then write the report.

## Live environment

| Tool                         | Result                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Claude Code                  | !`claude --version 2>/dev/null || echo "MISSING"`                                    |
| GitHub Copilot CLI           | !`copilot --version 2>/dev/null || echo "not installed (optional; npm i -g @github/copilot)"` |
| git                          | !`git --version 2>/dev/null || echo "MISSING"`                                       |
| node (hooks)                 | !`node --version 2>/dev/null || echo "MISSING - the auto-format hook needs Node"`   |
| python (scripts)             | !`python3 --version 2>/dev/null || python --version 2>/dev/null || echo "missing"`   |
| jq (shell hooks, optional)   | !`jq --version 2>/dev/null || echo "missing (shell hooks fall back to sed)"`         |
| pyright-langserver (LSP)     | !`pyright-langserver --version 2>/dev/null || echo "missing - npm i -g pyright"`     |
| typescript-language-server   | !`typescript-language-server --version 2>/dev/null || echo "missing - npm i -g typescript-language-server typescript"` |

## Installed plugins

```
!`claude plugin list 2>/dev/null | head -30 || echo "(could not list plugins)"`
```

## MCP servers

```
!`claude mcp list 2>&1 | head -20`
```

## Write the report

1. A table with one row per tool: OK or MISSING, and for MISSING the install
   command for the user's OS (Windows: `winget` or `npm`; macOS: `brew`;
   Linux: `apt` or `npm`).
2. Which parts of heyra-dev each missing tool affects:
   - node: the auto-format hook.
   - bash: the guard and git-context hooks (Git Bash on Windows).
   - language servers: LSP diagnostics.
   - Copilot CLI: only needed to use the plugin from Copilot.
3. Any MCP server that reports an error, with the likely cause.
4. End with "Nothing to fix" or a numbered list of commands to run.
