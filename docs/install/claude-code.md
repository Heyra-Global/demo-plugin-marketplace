# Install in Claude Code

Result: any of the six plugins is available in Claude Code sessions, at
user scope (everywhere) or project scope (one repository, committed for
the team).

## Add the marketplace and install

```bash
claude plugin marketplace add Heyra-Global/demo-plugin-marketplace
claude plugin install heyra-dev@heyra-demo --scope user
claude plugin install heyra-email@heyra-demo --scope user
```

Or interactively inside a session: `/plugin marketplace add
Heyra-Global/demo-plugin-marketplace`, then `/plugin` to browse and install.

Restart the session or run `/reload-plugins`. Skills appear as
`/heyra-email:inbox-triage`, `/heyra-dev:commit`, and so on.

## Pin it for a team (project scope)

Commit `.claude/settings.json` in the repository:

```json
{
  "extraKnownMarketplaces": {
    "heyra-demo": { "source": { "source": "github", "repo": "Heyra-Global/demo-plugin-marketplace" } }
  },
  "enabledPlugins": { "heyra-dev@heyra-demo": true }
}
```

Teammates who open the repository are prompted to install. The
`/heyra-dev:setup` skill writes this file for you.

## Try a plugin without installing

```bash
claude --plugin-dir ./plugins/heyra-marketing
```

Loads the plugin for that session only. `--plugin-dir ./plugins` loads all
of them.

## Update, disable, remove

```bash
claude plugin marketplace update heyra-demo
claude plugin update heyra-email@heyra-demo
claude plugin disable heyra-email@heyra-demo
claude plugin uninstall heyra-email@heyra-demo
claude plugin marketplace remove heyra-demo
```

## Connectors in Claude Code

The business plugins refer to Microsoft 365 as a Claude connector, which
does not exist in Claude Code. Their remote MCP servers (Fireflies,
HubSpot, Atlassian) do connect from Claude Code; run `/mcp` to sign in.
Every skill also works with pasted text.

## Validate a copy of this repository

```bash
claude plugin validate --strict .
bash scripts/validate-all.sh
```
