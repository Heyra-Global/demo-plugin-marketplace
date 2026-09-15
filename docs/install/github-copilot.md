# Install in GitHub Copilot

Result: the developer plugin `heyra-dev` (skills, custom agents, hooks, MCP
servers) is available in Copilot CLI, VS Code, the GitHub Copilot app and
the Copilot cloud agent. The business plugins can be installed too; their
skills load, but they are written for Claude's connectors.

Sources: GitHub Docs on
[Copilot CLI plugins](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-cli-plugins),
the [CLI plugin reference](https://docs.github.com/en/copilot/reference/copilot-cli-reference/cli-plugin-reference),
[VS Code agent plugins](https://code.visualstudio.com/docs/agent-customization/agent-plugins),
and [enterprise plugin standards](https://docs.github.com/en/copilot/how-tos/administer-copilot/manage-for-enterprise/manage-agents/configure-enterprise-plugin-standards),
checked September 2026. Copilot CLI 1.0.74 or newer is required for the
Agent Plugins 1.0 manifest.

## Why it works

This repository keeps the marketplace file in both places Copilot looks:
`.github/plugin/marketplace.json` (Copilot's default) and
`.claude-plugin/marketplace.json` (Claude's, which Copilot also reads). The
`heyra-dev` plugin ships a `plugin.json` in the Agent Plugins 1.0 format
next to the Claude manifest, Copilot custom agents under
`com.github.copilot/agents/`, and `mcp.json` next to `.mcp.json`.

## Copilot CLI

> **This repository is private.** Every command below needs your local
> `git`/`gh` (or the credentials Copilot CLI uses) to have at least read
> access to it — ask a plugin owner to add you as a collaborator, or work
> from your own copy (see Step 0 in the
> [admin guide](claude-enterprise-admin.md)) and substitute its
> `owner/repo`.

```bash
copilot plugin marketplace add Heyra-Global/demo-plugin-marketplace
copilot plugin install heyra-dev@heyra-demo
copilot plugin list
```

Inside an interactive session the same works as `/plugin marketplace add
...` and `/plugin install ...`. Skills become slash commands
(`/heyra-dev:commit`), the custom agents are selectable, the hooks run.

Update and remove:

```bash
copilot plugin update heyra-dev
copilot plugin uninstall heyra-dev
copilot plugin marketplace remove heyra-demo
```

Direct install without the marketplace:

```bash
copilot plugin install Heyra-Global/demo-plugin-marketplace:plugins/heyra-dev
```

## VS Code with Copilot

Option 1, user setting: add the repository to `chat.plugins.marketplaces`
in settings.json:

```json
{
  "chat.plugins.marketplaces": ["Heyra-Global/demo-plugin-marketplace"]
}
```

Then open the Plugins view in Chat and install `heyra-dev`.

Option 2, per repository, shared with the team: commit
`.github/copilot/settings.json` in the repository where the plugin should
be active (this repository has one):

```json
{
  "extraKnownMarketplaces": {
    "heyra-demo": { "source": { "source": "github", "repo": "Heyra-Global/demo-plugin-marketplace" } }
  },
  "enabledPlugins": { "heyra-dev@heyra-demo": true }
}
```

VS Code reads Claude-format plugins directly and supports
`${CLAUDE_PLUGIN_ROOT}` in MCP fields. VS Code ignores hook `matcher`
values, so the guard hook runs on every shell command and decides inside
the script, which is how it is written.

## GitHub Copilot app

**Customize > Plugins**, browse marketplaces, add
`Heyra-Global/demo-plugin-marketplace`, install `heyra-dev`.

## Copilot cloud agent (github.com)

The cloud agent installs plugins declaratively. In the repository the agent
works on, commit `.github/copilot/settings.json` with `extraKnownMarketplaces`
and `enabledPlugins` as in Option 2 above. The plugin's skills and Copilot
custom agents are then available to the agent on that repository.

## Copilot Business and Enterprise admins

Distribute to every developer with managed settings. In the organisation's
`.github-private` repository, file `copilot/managed-settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "heyra-demo": {
      "source": { "source": "github", "repo": "Heyra-Global/demo-plugin-marketplace" },
      "autoUpdate": true
    }
  },
  "enabledPlugins": { "heyra-dev@heyra-demo": true }
}
```

Managed settings apply to Copilot CLI, VS Code, JetBrains, the Copilot app
and the cloud agent. `strictKnownMarketplaces` can lock developers to the
listed marketplaces only. Managed MCP allow and deny lists apply to the
plugin's MCP servers.

Prefer a private copy of this repository under your own organisation for
production use, so you control the versions your developers receive. See
Step 0 in the [Claude Enterprise admin guide](claude-enterprise-admin.md)
for the three ways to copy it.

## What of heyra-dev works where

| Component                               | Copilot CLI | VS Code | Copilot app | Cloud agent |
| --------------------------------------- | :---------: | :-----: | :---------: | :---------: |
| Skills (`/heyra-dev:commit` and others) | yes         | yes     | yes         | yes         |
| Custom agents (`com.github.copilot/agents/`) | yes    | yes     | yes         | yes         |
| Hooks (`hooks/hooks.json`, Claude format) | yes       | yes     | not documented | camelCase `.github/hooks/` only |
| MCP servers (`mcp.json`)                | yes         | yes     | not documented | repository MCP settings |
| LSP servers (`.lsp.json`)               | legacy      | no      | no          | no          |

## Troubleshooting

| Symptom                                    | Fix                                                                                   |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| Marketplace not found                      | This repository is private: `copilot plugin marketplace add` needs a `gh`/git session with access to it. Ask a plugin owner to add you as a collaborator, or use `copilot plugin install owner/repo:plugins/heyra-dev` against your own copy |
| Plugin installs but skills do not appear   | Update Copilot CLI to 1.0.74 or newer; run `copilot plugin list`                       |
| Hook does not run in VS Code               | Expected for `matcher`-filtered hooks in Claude format; VS Code ignores matchers and the script filters itself |
| Enterprise: install refused                | A managed setting restricts marketplaces (`strictKnownMarketplaces`); ask the Copilot admin |
