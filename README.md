# heyra-demo: a Claude Code plugin marketplace

A demo marketplace by [Heyra](https://heyra.io) that shows what a Claude Code
plugin marketplace can contain. Four realistic plugins, one fictional client
brand, and every plugin component type in use: skills, subagents, hooks, MCP
servers, LSP servers, output styles, user configuration and evals.

> **Demo content.** "Nordlys Analytics" is an invented company. Nothing in
> this repository is client data. The structure is real; the brand is not.

## What a marketplace is

A marketplace is a git repository with one file, `.claude-plugin/marketplace.json`,
that lists plugins. A plugin is a folder with a `.claude-plugin/plugin.json`
manifest and any of the components below. Users add the marketplace once and
install plugins from it. Teams pin it in `.claude/settings.json` so everyone
gets the same plugins.

## Quick start

```text
/plugin marketplace add Heyra-Global/demo-cc-marketplace
/plugin install dev-toolkit@heyra-demo
/plugin install nordlys-brand@heyra-demo
```

Or, non-interactively:

```bash
claude plugin marketplace add Heyra-Global/demo-cc-marketplace
claude plugin install dev-toolkit@heyra-demo --scope user
```

Then open any repository and run `/dev-toolkit:setup`. It detects the stack
and installs the matching plugins at project scope.

This repository is private. Users need GitHub access to the `Heyra-Global`
organisation and a working `gh auth login` or git credentials.

## The plugins

| Plugin                                     | Category         | One line                                                                                  |
| ------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------------- |
| [nordlys-brand](plugins/nordlys-brand/)    | marketing        | Brand voice and palette for a fictional client, with a bundled MCP server and an eval suite |
| [fabric-toolkit](plugins/fabric-toolkit/)  | data-engineering | Microsoft Fabric design, notebook templates, fab CLI, guarded deployment, Fabric MCP        |
| [dbt-toolkit](plugins/dbt-toolkit/)        | data-engineering | dbt conventions, scaffolding, coverage report, build-and-fix loop, dbt MCP                |
| [dev-toolkit](plugins/dev-toolkit/)        | development      | Commit, PR, review, doctor and setup skills, guard rails, LSP and docs MCP servers         |

## Component matrix

Where each component type is demonstrated. Click through to the plugin
READMEs for the file-level map.

| Component                              | nordlys-brand | fabric-toolkit | dbt-toolkit | dev-toolkit |
| -------------------------------------- | :-----------: | :------------: | :---------: | :---------: |
| Skill, loaded by Claude on its own     | yes           | yes            | yes         | yes         |
| Skill, user-only (slash command)       | yes           | yes            | yes         | yes         |
| Skill, auto-loads on file `paths`      |               | yes            | yes         |             |
| Skill with named `arguments`           | yes           |                | yes         |             |
| Skill with `allowed-tools`             |               |                |             | yes         |
| Skill with dynamic context `` !`cmd` `` |              | yes            | yes         | yes         |
| Skill forked into a subagent           | yes           | yes            | yes         | yes         |
| Skill with `references/` or templates  | yes           | yes            | yes         |             |
| Subagent, read-only                    | yes           | yes            | yes         | yes         |
| Subagent that edits and runs commands  |               | yes            | yes         | yes         |
| Subagent preloading a skill (`skills:`)| yes           | yes            | yes         | yes         |
| Hook: SessionStart                     | yes           | yes            | conditional | matcher     |
| Hook: PreToolUse (deny / ask)          |               | with `if`      | yes         | bash        |
| Hook: PostToolUse (warn)               | yes           | yes            | yes         | format      |
| Hook: Stop, `type: prompt`             |               |                |             | yes         |
| Hook script language                   | Node          | Node           | Node        | bash + Node |
| MCP server, bundled in the plugin      | yes           |                |             |             |
| MCP server, public over HTTP           |               | yes (auth helper) |          | yes         |
| MCP server, public over stdio          |               |                | uvx         | npx         |
| LSP servers                            |               |                |             | yes         |
| Output style                           | yes           |                |             |             |
| `userConfig` (asked at install)        |               | yes            | yes         |             |
| Eval suite (`claude plugin eval`)      | yes           |                |             |             |
| Bundled helper scripts                 | Node          | Python + bash  | Python      |             |

## Repository layout

```
.claude-plugin/marketplace.json   the marketplace: name, owner, plugin list
.claude/settings.json             pins this marketplace + the plugin authoring stack for contributors
plugins/<name>/                   one folder per plugin (see each README)
templates/plugin-template/        copy this to start a new plugin
scripts/                          house-rule validator, hook smoke tests, validate-all
docs/DEMO.md                      presenter script, 20 minutes
docs/ARCHITECTURE.md              anatomy of a marketplace and a plugin, all component types
CONTRIBUTING.md                   how to add or change a plugin
.github/workflows/validate.yml    CI: syntax, house rules, hook tests, claude plugin validate
```

## Validate and test

```bash
bash scripts/validate-all.sh      # everything CI runs
claude plugin validate .          # just the manifests
node scripts/test-hooks.js        # every hook, with sample events
```

Try a plugin without installing it:

```bash
claude --plugin-dir ./plugins/nordlys-brand
```

Run the eval suite (costs tokens):

```bash
claude plugin eval plugins/nordlys-brand --runs 1
```

`claude plugin eval` is in early access. On an account without access the
command prints "plugin eval is currently in early access" and does nothing;
the suite is still a valid example of the format.

## Further reading

- [Presenter script](docs/DEMO.md)
- [Architecture reference](docs/ARCHITECTURE.md)
- Claude Code docs: [Plugins](https://code.claude.com/docs/en/plugins),
  [Plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces),
  [Plugins reference](https://code.claude.com/docs/en/plugins-reference),
  [Hooks](https://code.claude.com/docs/en/hooks-guide),
  [Skills](https://code.claude.com/docs/en/skills),
  [Subagents](https://code.claude.com/docs/en/sub-agents)
