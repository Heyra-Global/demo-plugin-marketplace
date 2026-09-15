---
name: setup
description:
  Register the heyra-demo marketplace for this repository and enable the
  developer plugin for Claude Code and GitHub Copilot at project scope, so
  every teammate gets the same setup from the committed settings files. Use
  when the user starts working in a new repository or asks how to enable
  the plugins for the team. For an environment check see doctor.
disable-model-invocation: true
---

# Setup

Configure this repository for the heyra-demo marketplace.

## Live project data

Marketplaces known to Claude Code:

```
!`claude plugin marketplace list 2>/dev/null || echo "(could not list marketplaces)"`
```

Installed plugins:

```
!`claude plugin list 2>/dev/null | head -30 || echo "(none)"`
```

Existing settings:

```
!`cat .claude/settings.json 2>/dev/null || echo "(no .claude/settings.json)"`
!`cat .github/copilot/settings.json 2>/dev/null || echo "(no .github/copilot/settings.json)"`
```

## Steps

1. If `heyra-demo` is not in the marketplace list, run
   `claude plugin marketplace add Heyra-Global/demo-plugin-marketplace`.
2. Install the developer plugin at project scope:
   `claude plugin install heyra-dev@heyra-demo -s project`.
   Project scope writes to `.claude/settings.json`, which is committed.
3. Ask one `AskUserQuestion`: also enable the plugin for GitHub Copilot
   users of this repository? If yes, merge this into
   `.github/copilot/settings.json` (create the file if needed, never
   overwrite other keys):

   ```json
   {
     "extraKnownMarketplaces": {
       "heyra-demo": { "source": { "source": "github", "repo": "Heyra-Global/demo-plugin-marketplace" } }
     },
     "enabledPlugins": { "heyra-dev@heyra-demo": true }
   }
   ```

   Copilot CLI, VS Code and the Copilot cloud agent read that file.
4. Mention the business plugins (heyra-marketing, heyra-email,
   heyra-meetings, heyra-sales, heyra-back-office). They are meant for
   Claude Chat and Cowork and are distributed by the Claude admin, but a
   Claude Code user can install any of them the same way.
5. Tell the user to restart Claude Code or run `/reload-plugins`.

Keep the whole interaction to one question.
