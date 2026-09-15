# Architecture: formats, surfaces and distribution

What the files in this repository are, which Claude and Copilot surfaces
read them, and how a company distributes them. Written in September 2026
from the official documentation linked at the end; the products move, so
verify before you promise a client anything.

## One marketplace, four surfaces

| Surface                    | Reads                                             | Installs from                                           |
| -------------------------- | ------------------------------------------------- | ------------------------------------------------------- |
| Claude Chat (web, desktop) | Plugins the admin or the user enabled; skills only | Organisation marketplace; plugins shared or uploaded    |
| Claude Cowork              | Same plugins; skills, connectors, subagents, hooks | Organisation marketplace; "Add marketplace" by URL; `.plugin` upload |
| Claude Code                | `.claude-plugin/marketplace.json`                  | `claude plugin marketplace add owner/repo`               |
| GitHub Copilot CLI, VS Code, cloud agent | `.claude-plugin/marketplace.json` or `.github/plugin/marketplace.json` | `copilot plugin marketplace add`, settings files |

The marketplace file format is shared by Claude Cowork, Claude Code and
Copilot. This repository keeps two identical copies so every tool finds it
at its default location; CI fails if they differ.

## The marketplace file

```json
{
  "name": "heyra-demo",
  "owner": { "name": "Heyra", "email": "hello@heyra.io" },
  "metadata": { "description": "...", "version": "2.0.0" },
  "plugins": [
    { "name": "heyra-email", "source": "./plugins/heyra-email", "description": "...", "version": "1.0.0", "category": "productivity" }
  ]
}
```

Rules that matter in practice: plugin names are lowercase words with
hyphens, at most 64 characters; relative `source` paths are the simplest
and are supported everywhere; organisation marketplaces in Claude also
accept `github`, `url` and `git-subdir` sources but not `npm`, `archive` or
`command`.

## A plugin

```
plugins/heyra-email/
├── .claude-plugin/plugin.json   manifest: name, version, description, author, pointers
├── README.md                    what it is, what it contains, how to try it
├── CONNECTORS.md                which ~~categories the skills use and what is pre-configured
├── .mcp.json                    remote MCP servers (optional)
├── skills/<name>/SKILL.md       one folder per skill, plus references/ and templates/
└── agents/<name>.md             subagents (optional; Cowork and Claude Code only)
```

Only `plugin.json` goes inside `.claude-plugin/`. Everything else sits at
the plugin root.

## Component by surface

| Component                     | Claude Chat | Claude Cowork | Claude Code | Copilot CLI | VS Code Copilot | Copilot cloud agent |
| ----------------------------- | :---------: | :-----------: | :---------: | :---------: | :-------------: | :-----------------: |
| Skills (`skills/*/SKILL.md`)  | yes         | yes, also as slash commands | yes | yes    | yes             | yes                 |
| Connectors, built-in (M365)   | yes         | yes           | via own MCP | no          | no              | no                  |
| Remote MCP in `.mcp.json`     | yes         | yes           | yes         | yes         | yes             | not documented      |
| Local MCP (`command`)         | no          | no            | yes         | yes         | yes             | not documented      |
| Subagents (`agents/*.md`)     | greyed out  | yes           | yes         | partial     | yes             | partial             |
| Copilot agents (`com.github.copilot/agents/*.agent.md`) | no | no | no  | yes         | yes             | yes                 |
| Hooks (`hooks/hooks.json`, PascalCase) | greyed out | yes  | yes         | yes         | yes (matchers ignored) | camelCase `.github/hooks/` only |
| LSP (`.lsp.json`)             | no          | no            | yes         | legacy      | no              | no                  |
| Output styles, evals, userConfig | no       | no            | yes         | no          | no              | no                  |

Practical consequences, applied in this repository:

- Business plugins carry **skills and connectors** only, plus one subagent
  in heyra-marketing to show the concept. They behave the same in Chat and
  Cowork.
- Business skills are **not** user-only (`disable-model-invocation`). Chat
  has no slash commands; a user-only skill would be unusable there.
- `.mcp.json` in business plugins lists **remote HTTPS servers only**. Chat
  and Cowork reach connectors through Anthropic's cloud.
- Built-in connectors such as Microsoft 365 are not listed in `.mcp.json`.
  Skills refer to them by category (`~~email`, `~~calendar`, `~~files`) and
  `CONNECTORS.md` says what is pre-configured. This is the pattern of
  Anthropic's own knowledge-work plugins.
- heyra-dev carries everything a developer tool can use, in both formats.

## Skills

Markdown with YAML frontmatter. The description is the trigger: what the
skill does, "Use when ...", and routing to sibling skills. Fields honoured
by every surface: `name`, `description`, `license`, `allowed-tools`.
Claude Code and VS Code also honour `argument-hint`, `disable-model-invocation`,
`user-invocable`, `context: fork` with `agent:`. Claude Code additionally
honours `paths`, `arguments`, `model`, `effort`.

In the body: `$ARGUMENTS`, `${CLAUDE_SKILL_DIR}`, and `` !`command` `` for
dynamic context (Claude Code). Bundled `references/`, `templates/` and
`scripts/` are read on demand. Keep `SKILL.md` under 500 lines and the
description under 1,024 characters.

Never put a colon followed by a space inside a folded description; YAML
reads it as a mapping key and the whole frontmatter is dropped at runtime.
`scripts/check-marketplace.py` catches it.

## Two manifests for developer plugins

| File                      | Format                | Readers                                          |
| ------------------------- | --------------------- | ------------------------------------------------ |
| `.claude-plugin/plugin.json` | Claude              | Claude Chat, Cowork, Claude Code, Copilot CLI (legacy discovery) |
| `plugin.json` (root)      | Agent Plugins 1.0     | Copilot CLI, VS Code, Copilot app, other clients (Cursor, Codex, Kiro) |
| `.mcp.json`               | Claude (`type: http` / `command`) | Claude tools                          |
| `mcp.json`                | Agent Plugins (`stdio`, `streamable-http`, `sse`) | Agent Plugins clients      |
| `agents/*.md`             | Claude subagent       | Claude Code, Cowork                              |
| `com.github.copilot/agents/*.agent.md` | Copilot custom agent | Copilot surfaces                     |
| `hooks/hooks.json`        | Claude (PascalCase events) | Claude Code; Copilot CLI and VS Code accept it |

Agent Plugins 1.0 requires `$schema` and `name`; `author` is an object;
extra fields are not allowed. `${PLUGIN_ROOT}` is the Agent Plugins
equivalent of `${CLAUDE_PLUGIN_ROOT}`.

## Distribution and visibility

| Path                                              | Repository visibility            | Who acts            |
| ------------------------------------------------- | -------------------------------- | ------------------- |
| Claude organisation marketplace (GitHub sync)     | private or internal, GitHub App installed | Owner / Primary Owner |
| Claude organisation marketplace (zip upload)      | any (zip ≤ 50 MB, ≤ 100 plugins) | Owner / Primary Owner |
| Cowork "Add marketplace" by URL                   | public works; private not documented | any user         |
| Cowork "Upload a file" (`.plugin` zip)            | any                              | any user            |
| Peer sharing (Customize > Plugins > Share)        | n/a                              | member, if the admin allowed sharing |
| Claude Code `claude plugin marketplace add`       | any the user's git can reach     | developer           |
| Copilot CLI `copilot plugin marketplace add`      | any the user's git can reach     | developer           |
| Copilot `.github/copilot/settings.json`           | any                              | repository owner    |
| Copilot managed settings (`.github-private/copilot/managed-settings.json`) | any | Copilot admin |

Organisation-managed plugins appear in Chat and Cowork; members cannot
edit them. Members need no GitHub account: the admin's access is verified
once and the sync then runs through the Claude GitHub App installed on the
repository. The rollout guide is [INSTALL.md](INSTALL.md). Install states: Installed by default, Available for install,
Required, Not available; Enterprise groups can override per group. Sync
runs when a pull request with a version bump merges to the default branch,
if auto-update is on. Enterprise security scanning checks uploaded plugins.

Limits (Cowork): 200 MB uncompressed per plugin, 5,000 files, 512 MB
repository archive, 500 plugins per marketplace, 25 marketplaces per user.

## Versioning

Every plugin change bumps `version` in the plugin's manifest(s) and in
both marketplace files. CI enforces the bump on pull requests. The
organisation marketplace's auto-update watches for exactly that bump.

## CLI cheat sheet

```bash
# Claude Code
claude plugin marketplace add Heyra-Global/demo-plugin-marketplace
claude plugin install heyra-email@heyra-demo --scope user
claude plugin validate --strict plugins/heyra-email
claude --plugin-dir ./plugins/heyra-email

# GitHub Copilot CLI
copilot plugin marketplace add Heyra-Global/demo-plugin-marketplace
copilot plugin install heyra-dev@heyra-demo
copilot plugin list

# This repository
bash scripts/validate-all.sh
python scripts/package-plugins.py        # dist/<name>.plugin for manual upload
```

## Sources

- Use plugins in Claude (Help Center): https://support.claude.com/en/articles/13837440-use-plugins-in-claude
- Manage plugins for your organization: https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization
- Cowork plugins guide: https://claude.com/docs/cowork/guide/plugins
- Knowledge-work plugins (Anthropic): https://github.com/anthropics/knowledge-work-plugins
- Claude Code plugins reference: https://code.claude.com/docs/en/plugins-reference
- Plugin marketplaces (Claude Code): https://code.claude.com/docs/en/plugin-marketplaces
- Copilot CLI plugins: https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-cli-plugins
- Copilot CLI plugin reference: https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference
- VS Code agent plugins: https://code.visualstudio.com/docs/agent-customization/agent-plugins
- Agent Plugins 1.0: https://agent-plugins.org/specification
- Agent Skills: https://agentskills.io/specification
