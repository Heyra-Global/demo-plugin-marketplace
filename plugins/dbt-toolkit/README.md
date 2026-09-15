# dbt-toolkit

dbt analytics engineering plugin. It complements the official `dbt` plugin
from dbt Labs (which teaches dbt itself) with house conventions, scaffolding,
guard rails and a fix loop, the way a consultancy would package its way of
working for a client team.

## What is in it

| Component                       | Where                                     | What it shows                                                                              |
| ------------------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------ |
| Skill (auto-loads on paths)     | `skills/dbt-conventions/`                 | `paths: models/**` so the rules are present whenever a model is touched. `references/` on demand |
| Skill (named arguments)         | `skills/dbt-new-model/`                   | `arguments: [model_name, layer]`, live `` !`ls models/$layer` ``, bundled SQL and YAML templates |
| Skill (bundled script output)   | `skills/dbt-test-coverage/`               | `` !`python scripts/test_coverage.py` `` puts a real report into context at load time         |
| Skill (forked)                  | `skills/dbt-build-fix/`                   | `context: fork` + `agent: dbt-runner`                                                       |
| Subagent (does work)            | `agents/dbt-runner.md`                    | Bash + Edit, preloads dbt-conventions with `skills:`                                          |
| Subagent (cheap reviewer)       | `agents/sql-reviewer.md`                  | `model: haiku` for a fast, low-cost review                                                   |
| Hook: PreToolUse                | `hooks/guard-prod.js`                     | Denies full refreshes on prod, asks on any prod command                                      |
| Hook: PostToolUse               | `hooks/model-lint.js`                     | Naming, lineage, `select *`, missing tests. Warns, does not block                            |
| Hook: SessionStart (conditional)| `hooks/project-context.js`                | Adds context only when `dbt_project.yml` exists                                              |
| MCP server (public, stdio)      | `.mcp.json`                               | Official `dbt-mcp` via `uvx`, project dir from `${CLAUDE_PROJECT_DIR}`, dbt path from `userConfig` |
| userConfig                      | `.claude-plugin/plugin.json`              | `dbt_path`, referenced as `${user_config.dbt_path}` in `.mcp.json`                           |
| Helper script                   | `scripts/test_coverage.py`                | Standard-library YAML parsing, `--json` output                                               |

## Try it

```text
/plugin install dbt-toolkit@heyra-demo
```

In a dbt project:

```text
/dbt-toolkit:dbt-new-model stg_shop__orders staging
/dbt-toolkit:dbt-test-coverage
/dbt-toolkit:dbt-build-fix --select +fct_orders
Run: dbt run --target prod --full-refresh            (the guard hook denies it)
```

Edit any file under `models/` and the conventions skill loads on its own.
Save a model without a `.yml` entry and the model-lint hook reports it.

## Prerequisites

- Node.js 18+ (hooks)
- Python 3.9+ (coverage script)
- `uv` on PATH for the MCP server (`uvx dbt-mcp`), plus dbt itself

Without dbt installed the skills, hooks and coverage script still work; only
the MCP server and the build loop need dbt.
