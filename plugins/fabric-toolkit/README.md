# fabric-toolkit

Microsoft Fabric data engineering plugin. A demo version of the kind of
platform plugin Heyra builds for clients: design guidance, notebook templates,
CLI reference, a guarded deployment flow and a connection to the Fabric MCP
server.

## What is in it

| Component                       | Where                                        | What it shows                                                                          |
| ------------------------------- | -------------------------------------------- | -------------------------------------------------------------------------------------- |
| Skill (design reference)        | `skills/fabric-architect/`                   | Decision tables plus a `references/` file loaded on demand                              |
| Skill (auto-loads on files)     | `skills/fabric-engineer/`                    | `paths:` frontmatter: loads when Claude touches `*.ipynb` or `notebooks/**`. Bundled runnable templates |
| Skill (live environment data)   | `skills/fabric-cli/`                         | `` !`fab --version` `` dynamic context injected at load time                            |
| Skill (forked, user-only)       | `skills/fabric-deploy/`                      | `context: fork` + `agent: fabric-deployer`, `disable-model-invocation`                  |
| Subagent (read-only)            | `agents/notebook-reviewer.md`                | Preloads the fabric-engineer skill with `skills:`                                       |
| Subagent (does work)            | `agents/fabric-deployer.md`                  | `Bash` access, `effort: high`, `maxTurns`                                               |
| Hook: PreToolUse with `if`      | `hooks/guard-fab.js`                         | Denies destructive `fab` commands on production, asks on others. `if: "Bash(fab *)"` filters cheaply |
| Hook: PostToolUse               | `hooks/notebook-lint.js`                     | Lints notebooks for GUIDs, secrets, blind appends and Parquet writes                    |
| Hook: SessionStart              | `hooks/session-context.js`                   | Reads `userConfig` values from `CLAUDE_PLUGIN_OPTION_*` environment variables            |
| MCP server (public, HTTP)       | `.mcp.json` + `scripts/mcp_auth_header.sh`   | Fabric Core MCP with a `headersHelper` that mints an Azure CLI token per connection      |
| userConfig                      | `.claude-plugin/plugin.json`                 | `workspace_name` and `production_workspace`, asked once at install, used by hooks         |
| Helper script                   | `scripts/list_items.py`                      | Zero-dependency REST client with pagination                                              |

## Try it

```text
/plugin install fabric-toolkit@heyra-demo
```

Then:

```text
Design a Fabric workspace layout for a sales analytics platform      (fabric-architect loads on its own)
Open notebooks/bronze_orders.py and ask for a review                 (fabric-engineer loads via paths; notebook-reviewer subagent)
/fabric-toolkit:fabric-deploy --workspace nordlys-dev                (plan only, in a subagent)
Run: fab rm /nordlys-prod.Workspace/x.Notebook                       (the guard hook denies it)
```

Write a `.py` file under `notebooks/` that contains a GUID and watch the
notebook-lint hook report it.

## Prerequisites

- Node.js 18+ (hooks)
- Python 3.10+ (helper script)
- `az login` for the MCP server and the REST helper
- `pip install ms-fabric-cli` for the fab skill and deployment

The plugin works without any of the Fabric tooling installed. The skills then
say so in their live-environment lines instead of failing.
