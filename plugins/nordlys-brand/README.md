# nordlys-brand

Brand guidelines and marketing plugin for **Nordlys Analytics**, a fictional
company invented for this demo. It is the plugin that shows the widest range of
component types.

## What is in it

| Component                    | Where                                    | What it shows                                                                                |
| ---------------------------- | ---------------------------------------- | -------------------------------------------------------------------------------------------- |
| Skill (auto + user)          | `skills/brand-guidelines/`               | A reference skill Claude loads on its own. Has a `references/` file for progressive loading   |
| Skill (user-only, `$ARGUMENTS`) | `skills/linkedin-post/`               | `disable-model-invocation`, `argument-hint`, a bundled template                              |
| Skill (named arguments)      | `skills/campaign-brief/`                 | `arguments: [campaign, audience]` become `$campaign` and `$audience`                         |
| Skill (forked into a subagent) | `skills/brand-check/`                  | `context: fork` + `agent: brand-reviewer`: the review runs outside the main context           |
| Subagent                     | `agents/brand-reviewer.md`               | Read-only tools, `model`, `color`, `maxTurns`, and `skills:` preloading                       |
| Hook: SessionStart           | `hooks/session-context.js`               | Adds a short brand reminder via `additionalContext`                                          |
| Hook: PostToolUse            | `hooks/banned-words.js`                  | Scans every written Markdown file for banned words and reports them (warning, not a block)    |
| MCP server (bundled)         | `mcp/brand-assets-server.js`             | Zero-dependency Node.js stdio server with 5 tools and 3 resources. Started via `.mcp.json`    |
| Output style                 | `output-styles/nordlys-marketing.md`     | A selectable writing style. `force-for-plugin` can make it automatic                          |
| Eval suite                   | `evals/`                                 | Two cases with regex, tool_used and LLM graders for `claude plugin eval`                      |
| Shared assets                | `assets/`                                | One source of truth (palette, banned words, logo) read by skills, hooks and the MCP server    |

## Try it

```text
/plugin install nordlys-brand@heyra-demo
```

Then, in a Claude Code session:

```text
/nordlys-brand:linkedin-post We cut a client's month-end close from 9 to 4 days --audience cto
/nordlys-brand:campaign-brief Fabric migration launch, CTOs at manufacturers
/nordlys-brand:brand-check marketing/campaigns/fabric-migration-launch.md
What are the Nordlys brand colours?              (loads the skill on its own)
Does Ice White text work on Aurora Green?         (Claude calls the MCP tool check_contrast)
```

Write a Markdown file that contains the word "leverage" and watch the
PostToolUse hook report it.

## Run the eval suite

```bash
claude plugin eval plugins/nordlys-brand --runs 1
```

This costs real tokens. Results land in `evals/results/` (git-ignored).
`claude plugin eval` is in early access; without access the command prints
"plugin eval is currently in early access" and exits. The case files still
document the format.

## Test the MCP server without Claude

```bash
node plugins/nordlys-brand/mcp/smoke-test.js
```

## Prerequisites

Node.js 18 or newer on PATH (for the hooks and the MCP server). Nothing else.
