---
name: doctor
description:
  Check the local machine for the tools the heyra-demo plugins need - git,
  Node, Python, uv, jq, Azure CLI, fab, dbt, language servers - plus the
  installed plugins and MCP servers, and report what is missing with the
  install command. Use when a plugin does not work, a hook or MCP server
  fails, or the user asks "is my setup ok". For first-time project setup see
  setup.
disable-model-invocation: true
---

# Doctor

Every line below is filled in when the skill loads, by running the command
inline (`` !`command` ``). Read them, then write the report.

## Live environment

| Tool                         | Result                                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------- |
| Claude Code                  | !`claude --version 2>/dev/null || echo "MISSING"`                                    |
| git                          | !`git --version 2>/dev/null || echo "MISSING"`                                       |
| node (hooks, MCP)            | !`node --version 2>/dev/null || echo "MISSING - needed by most hooks in this marketplace"` |
| python (scripts)             | !`python3 --version 2>/dev/null || python --version 2>/dev/null || echo "MISSING"`   |
| uv (dbt MCP)                 | !`uv --version 2>/dev/null || echo "MISSING - dbt-toolkit MCP needs uvx"`            |
| jq (shell hooks, optional)   | !`jq --version 2>/dev/null || echo "missing (shell hooks fall back to sed)"`         |
| az (fabric MCP)              | !`az version 2>/dev/null | head -1 || echo "MISSING - fabric-toolkit MCP needs az login"` |
| fab (fabric CLI)             | !`fab --version 2>/dev/null || echo "missing - pip install ms-fabric-cli"`           |
| dbt                          | !`dbt --version 2>/dev/null | head -1 || echo "missing - dbt-toolkit build loop needs dbt"` |
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
   command for the user's OS (detect it from the paths above: Windows uses
   `winget` or `pip`, macOS `brew`, Linux `apt` or `pip`).
2. Which plugins from this marketplace are affected by each missing tool:
   - node: every hook in nordlys-brand, fabric-toolkit, dbt-toolkit and the
     auto-format hook; the brand-assets MCP server.
   - uv: dbt MCP server.
   - az: fabric-core MCP server, `scripts/list_items.py`.
   - fab: fabric-cli skill and fabric-deploy.
   - dbt: dbt-build-fix and the dbt MCP server.
   - language servers: dev-toolkit LSP diagnostics.
3. Any MCP server that reports an error in the list above, with the likely
   cause (not logged in, tool missing).
4. End with "Nothing to fix" or a numbered list of commands to run.
