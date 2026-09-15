# my-plugin

One paragraph: what this plugin does and who installs it. Say where it
works: Claude Chat, Claude Cowork, Claude Code, GitHub Copilot.

## What is in it

| Component  | Where                          | Works in                  | What it does |
| ---------- | ------------------------------ | ------------------------- | ------------ |
| Skill      | `skills/example-skill/`        | Chat, Cowork, Claude Code |              |
| Subagent   | `agents/example-agent.md`      | Cowork, Claude Code       |              |
| Connectors | `CONNECTORS.md`, `.mcp.json`   | Chat, Cowork, Claude Code |              |

Delete the rows and files you do not need. A plugin with one skill and a
CONNECTORS file is a complete plugin for Chat and Cowork users.

Developer plugins that must also install in GitHub Copilot add a
`plugin.json` at the root (Agent Plugins 1.0), a `mcp.json`, and Copilot
agents under `com.github.copilot/agents/`. See `plugins/heyra-dev` for the
pattern.

## Try it

```text
<a prompt a user would type in Chat or Cowork>
```

## Prerequisites

Connectors the user turns on (Microsoft 365, a CRM). Business plugins must
work without them, with pasted text.
