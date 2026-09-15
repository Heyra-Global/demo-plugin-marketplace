---
name: setup
description:
  Detect the tech stack of the current repository, recommend which heyra-demo
  plugins to enable for it, install the chosen ones at project scope, and
  register the marketplace in .claude/settings.json so teammates get the same
  setup. Use when the user starts working in a new repository or asks which
  plugins to install. For an environment check see doctor.
disable-model-invocation: true
---

# Setup

Configure this repository for the heyra-demo marketplace.

## Live project data

Detected files:

```
!`ls -1d dbt_project.yml notebooks *.ipynb marketing pyproject.toml package.json requirements.txt 2>/dev/null | sed 's/^/  - /' || echo "  (no indicators found)"`
```

Marketplaces known to Claude Code:

```
!`claude plugin marketplace list 2>/dev/null || echo "(could not list marketplaces)"`
```

Installed plugins:

```
!`claude plugin list 2>/dev/null | head -30 || echo "(none)"`
```

Existing project settings:

```
!`cat .claude/settings.json 2>/dev/null || echo "(no .claude/settings.json)"`
```

## Detection rules

| Indicator                          | Recommend       | Why                                        |
| ---------------------------------- | --------------- | ------------------------------------------ |
| `dbt_project.yml`                  | dbt-toolkit     | Conventions, guard hooks, dbt MCP          |
| `notebooks/` or `*.ipynb`          | fabric-toolkit  | Notebook rules, deployment, Fabric MCP     |
| `marketing/` or a `content/` folder | nordlys-brand  | Brand voice, banned-word hook              |
| any code repository                | dev-toolkit     | Commit, PR, review, guard rails, LSP       |

## Steps

1. If `heyra-demo` is not in the marketplace list, run
   `claude plugin marketplace add Heyra-Global/demo-cc-marketplace`.
2. Apply the detection rules. Present the recommendation as a short table.
3. Ask **one** `AskUserQuestion` with `multiSelect: true` listing the four
   plugins; mark recommended ones "(Recommended)".
4. For each chosen plugin run
   `claude plugin install <name>@heyra-demo -s project`.
   Project scope writes to `.claude/settings.json`, which is committed, so
   every teammate gets the same plugins.
5. Offer to add the marketplace to `.claude/settings.json` under
   `extraKnownMarketplaces` (merge, never overwrite other keys):

   ```json
   {
     "extraKnownMarketplaces": {
       "heyra-demo": {
         "source": { "source": "github", "repo": "Heyra-Global/demo-cc-marketplace" }
       }
     }
   }
   ```

6. Tell the user to restart Claude Code (or run `/reload-plugins`) and, for
   fabric-toolkit and dbt-toolkit, that Claude Code will ask for the
   `userConfig` values (workspace names, dbt path) on first load.

Keep the whole interaction to two questions at most.
