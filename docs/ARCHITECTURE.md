# Architecture: marketplace and plugin anatomy

A reference for the file formats used in this repository, with pointers to
where each one is demonstrated. The official documentation is at
https://code.claude.com/docs/en/plugins-reference; this page is the short
version that matches what the demo contains.

## The marketplace

```
.claude-plugin/marketplace.json
```

```json
{
  "name": "heyra-demo",
  "owner": { "name": "Heyra", "email": "hello@heyra.io" },
  "metadata": { "description": "...", "version": "1.0.0" },
  "plugins": [
    {
      "name": "dev-toolkit",
      "source": "./plugins/dev-toolkit",
      "description": "...",
      "version": "1.0.0",
      "author": { "name": "Heyra", "email": "hello@heyra.io" },
      "license": "MIT",
      "keywords": ["git", "commit"],
      "category": "development"
    }
  ]
}
```

`source` can also be a GitHub repository (`{"source": "github", "repo":
"org/repo", "ref": "v1.2.0"}`), a git URL, a subdirectory of a git
repository, an npm package or a zip archive. This demo keeps every plugin in
the same repository, which is the simplest way to version them together.

Users add it with `/plugin marketplace add Heyra-Global/demo-cc-marketplace`.
Teams pin it in `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "heyra-demo": { "source": { "source": "github", "repo": "Heyra-Global/demo-cc-marketplace" } }
  },
  "enabledPlugins": { "dev-toolkit@heyra-demo": true }
}
```

## A plugin

```
plugins/<name>/
├── .claude-plugin/plugin.json   manifest (only this file goes in here)
├── README.md
├── skills/<skill>/SKILL.md      skills (+ references/, templates/, scripts/)
├── agents/<agent>.md            subagents
├── hooks/hooks.json             hooks (+ the scripts they run)
├── .mcp.json                    MCP servers
├── .lsp.json                    language servers
├── output-styles/<style>.md     output styles
├── evals/<case>/                eval cases for `claude plugin eval`
└── scripts/, assets/            anything the components need
```

`plugin.json` needs only `name`. Everything else is optional metadata plus
pointers to components that live somewhere other than the default location:

```json
{
  "name": "fabric-toolkit",
  "version": "1.0.0",
  "description": "...",
  "author": { "name": "Heyra", "email": "hello@heyra.io" },
  "hooks": "./hooks/hooks.json",
  "mcpServers": "./.mcp.json",
  "lspServers": "./.lsp.json",
  "outputStyles": "./output-styles/",
  "userConfig": {
    "workspace_name": { "type": "string", "title": "Fabric workspace", "default": "nordlys-dev" }
  }
}
```

When a plugin is installed, its skills are namespaced: `/dev-toolkit:commit`.

## Component types

### Skills (`skills/<name>/SKILL.md`)

Markdown with YAML frontmatter. The description is what Claude matches
against the conversation, so it carries the trigger ("Use when ...").

| Frontmatter                 | Effect                                                      | Demonstrated in                          |
| --------------------------- | ----------------------------------------------------------- | ---------------------------------------- |
| `description`               | Auto-invocation trigger and the text in `/skills`           | every skill                              |
| `disable-model-invocation`  | Only the user can run it (a slash command)                  | `dev-toolkit/commit`                     |
| `user-invocable: false`     | Only Claude can load it                                     | (not used; reference skills stay both)   |
| `paths`                     | Auto-loads when Claude touches matching files               | `dbt-toolkit/dbt-conventions`, `fabric-toolkit/fabric-engineer` |
| `argument-hint`             | Autocomplete hint                                           | most user-invoked skills                 |
| `arguments`                 | Named arguments as `$name`                                  | `nordlys-brand/campaign-brief`, `dbt-toolkit/dbt-new-model` |
| `allowed-tools`             | Pre-approved tools for the skill's turn                     | `dev-toolkit/commit`                     |
| `context: fork` + `agent`   | Runs in a subagent                                          | `*/brand-check`, `fabric-deploy`, `dbt-build-fix`, `review-changes` |
| `model`, `effort`           | Model and effort override                                   | (documented in the template)             |

In the body: `$ARGUMENTS`, `$0`/`$1`, `${CLAUDE_SKILL_DIR}`,
`${CLAUDE_PROJECT_DIR}`, and `` !`command` `` for dynamic context that runs
at load time (`dev-toolkit/doctor` is a table of them).

### Subagents (`agents/<name>.md`)

Markdown with frontmatter; the body is the system prompt.

| Frontmatter          | Effect                                              | Demonstrated in                 |
| -------------------- | --------------------------------------------------- | ------------------------------- |
| `tools`, `disallowedTools` | Tool allow and deny lists                     | `dev-toolkit/code-reviewer`     |
| `model`              | `sonnet`, `haiku`, `opus` or a full id              | `dbt-toolkit/sql-reviewer` (haiku) |
| `effort`, `maxTurns` | Budget                                              | `dev-toolkit/code-reviewer`     |
| `skills`             | Skills preloaded into the agent's context           | every agent in this repo        |
| `color`              | Display colour                                      | every agent                     |
| `background`, `isolation: worktree`, `memory` | Execution options          | (documented in the template)    |

Plugin-shipped agents cannot define `hooks`, `mcpServers` or
`permissionMode`.

### Hooks (`hooks/hooks.json`)

```json
{
  "hooks": {
    "PreToolUse": [
      { "matcher": "Bash", "hooks": [ { "type": "command", "if": "Bash(fab *)", "command": "node \"${CLAUDE_PLUGIN_ROOT}/hooks/guard-fab.js\"", "timeout": 10 } ] }
    ],
    "Stop": [
      { "hooks": [ { "type": "prompt", "prompt": "...", "model": "claude-haiku-4-5-20251001" } ] }
    ]
  }
}
```

Events used here: `SessionStart` (matchers `startup|resume|clear|compact`),
`PreToolUse`, `PostToolUse` (matchers are tool names, regex allowed), `Stop`.
Others exist: `UserPromptSubmit`, `Notification`, `SubagentStop`,
`PreCompact`, `SessionEnd` and more.

Hook types: `command` (a program; JSON in on stdin, JSON out on stdout),
`prompt` (a model answers `{"ok": true|false, "reason"}`), `agent` (a
subagent with tools verifies something).

Output contract for command hooks:

| Event        | To block or steer                                                                                     |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| PreToolUse   | `{"hookSpecificOutput": {"hookEventName": "PreToolUse", "permissionDecision": "deny"\|"ask"\|"allow", "permissionDecisionReason": "..."}}` |
| PostToolUse  | `{"hookSpecificOutput": {"hookEventName": "PostToolUse", "additionalContext": "..."}}` (or `decision: "block"` + `reason`) |
| SessionStart | `{"hookSpecificOutput": {"hookEventName": "SessionStart", "additionalContext": "..."}}`                |
| Stop         | `{"decision": "block", "reason": "..."}`                                                             |

Exit 0 with no output means "nothing to add". Exit 2 with text on stderr
blocks. `${CLAUDE_PLUGIN_ROOT}` resolves to the installed plugin folder;
quote it. `userConfig` values arrive as `CLAUDE_PLUGIN_OPTION_<KEY>`.

Demonstrated: Node hooks in three plugins, bash hooks and a prompt hook in
`dev-toolkit`. All of them are exercised by `scripts/test-hooks.js`.

### MCP servers (`.mcp.json`)

```json
{
  "mcpServers": {
    "brand-assets": { "command": "node", "args": ["${CLAUDE_PLUGIN_ROOT}/mcp/brand-assets-server.js"] },
    "fabric-core":  { "type": "http", "url": "https://api.fabric.microsoft.com/v1/mcp/core", "headersHelper": "${CLAUDE_PLUGIN_ROOT}/scripts/mcp_auth_header.sh" },
    "dbt":          { "command": "uvx", "args": ["dbt-mcp"], "env": { "DBT_PROJECT_DIR": "${CLAUDE_PROJECT_DIR}", "DBT_PATH": "${user_config.dbt_path}" } },
    "context7":     { "type": "http", "url": "https://mcp.context7.com/mcp", "headers": { "CONTEXT7_API_KEY": "${CONTEXT7_API_KEY:-}" } }
  }
}
```

Four shapes: bundled stdio (nordlys-brand), HTTP with a token helper
(fabric-toolkit), stdio through a package runner with `userConfig`
(dbt-toolkit), HTTP with an optional API key from the environment
(dev-toolkit). Tools appear to Claude as `mcp__plugin_<plugin>_<server>__<tool>`.

### LSP servers (`.lsp.json`)

```json
{ "python": { "command": "pyright-langserver", "args": ["--stdio"], "extensionToLanguage": { ".py": "python" } } }
```

Claude gets diagnostics after every edit. The binary is a prerequisite the
user installs. Demonstrated in `dev-toolkit`.

### Output styles (`output-styles/<name>.md`)

Frontmatter `name`, `description`, `force-for-plugin`,
`keep-coding-instructions`; the body is appended to the system prompt while
the style is active. Demonstrated in `nordlys-brand`.

### userConfig (in `plugin.json`)

Typed settings Claude Code asks for when the plugin is enabled. Referenced
as `${user_config.<key>}` in `.mcp.json`, `.lsp.json` and `hooks.json`, and
exported as `CLAUDE_PLUGIN_OPTION_<KEY>` to scripts. Demonstrated in
`fabric-toolkit` (workspace names used by the guard hook) and `dbt-toolkit`
(dbt path used by the MCP server).

### Evals (`evals/<case>/`)

```
evals/linkedin-post-no-hype/
├── prompt.md          frontmatter: runs, max_turns, allowed_tools; body: the prompt
└── graders/
    ├── no-banned-words.md   type: regex
    ├── skill-fired.md       type: tool_used, arm: with-only
    └── tone.md              type: llm
```

`claude plugin eval plugins/nordlys-brand` runs each case with and without
the plugin and reports the score delta. Demonstrated in `nordlys-brand`.

## Install scopes and distribution

| Scope   | Written to                    | Use for                                  |
| ------- | ----------------------------- | ---------------------------------------- |
| user    | `~/.claude/settings.json`     | Personal tools, present in every project |
| project | `.claude/settings.json`       | Team tools, committed with the repo      |
| local   | `.claude/settings.local.json` | Personal overrides in one project        |

`claude plugin install <name>@heyra-demo --scope project` and
`/dev-toolkit:setup` do this for you.

## CLI cheat sheet

```bash
claude plugin marketplace add Heyra-Global/demo-cc-marketplace
claude plugin install dev-toolkit@heyra-demo --scope user
claude plugin list
claude plugin details dev-toolkit@heyra-demo     # component inventory and token cost
claude plugin validate .                          # marketplace
claude plugin validate plugins/dev-toolkit        # one plugin, --strict for CI
claude --plugin-dir ./plugins/dev-toolkit         # try without installing
claude plugin eval plugins/nordlys-brand --runs 1
claude plugin tag plugins/dev-toolkit --dry-run   # release tag name--vX.Y.Z
```
