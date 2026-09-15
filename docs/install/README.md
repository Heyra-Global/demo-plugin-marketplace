# Installation guides

Pick the guide for your situation. Each one is complete on its own.

| You are                                                     | Guide                                                         | Time   |
| ----------------------------------------------------------- | ------------------------------------------------------------- | ------ |
| A Claude Enterprise or Team **admin** rolling the plugins out to the whole organisation | [Claude Enterprise admin](claude-enterprise-admin.md) | 20 min |
| **One person** using Claude Chat or Claude Cowork in Claude Desktop or on the web | [Claude Desktop and web, individual](claude-desktop-individual.md) | 5 min |
| A **developer** using GitHub Copilot (CLI, VS Code, the Copilot app, the cloud agent), or a Copilot admin | [GitHub Copilot](github-copilot.md) | 5 min |
| A **developer** using Claude Code                            | [Claude Code](claude-code.md)                                 | 2 min  |

Background reading: [Rollout guide](../INSTALL.md) (roles, recommendation,
what employees see) and [Contributing without a code editor](../CONTRIBUTE-WITHOUT-CODE.md).

> **This repository is private.** Every path below needs GitHub access to
> it (as a collaborator) or to your own copy of it. The Claude Enterprise
> path is the one built for a private repository and needs GitHub access
> only for the one admin who connects it — see the
> [admin guide](claude-enterprise-admin.md) for how to get that access or
> make a copy.

## The one-line version

Assumes the reader (or the one admin, for the Enterprise row) already has
GitHub access to this repository or a copy of it.

| Surface                     | Command or click path                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| Claude Enterprise admin     | Organization settings > Plugins > Add plugins > GitHub > `Heyra-Global/demo-plugin-marketplace` (or your own copy) |
| Claude Cowork, one user     | Customize > Plugins > Add marketplace > Add from a repository > `Heyra-Global/demo-plugin-marketplace` (not documented as supported for individuals; use the row below instead) |
| Claude Chat or Cowork, one user, no marketplace | Customize > Plugins > upload a `.plugin` file a plugin owner hands you |
| GitHub Copilot CLI          | `copilot plugin marketplace add Heyra-Global/demo-plugin-marketplace` then `copilot plugin install heyra-dev@heyra-demo` |
| VS Code with Copilot        | Setting `chat.plugins.marketplaces`: add `Heyra-Global/demo-plugin-marketplace`                 |
| Claude Code                 | `claude plugin marketplace add Heyra-Global/demo-plugin-marketplace` then `claude plugin install heyra-email@heyra-demo` |

## Which plugins work where

| Plugin             | Claude Chat | Claude Cowork | Claude Code | GitHub Copilot |
| ------------------ | :---------: | :-----------: | :---------: | :------------: |
| heyra-essentials   | yes         | yes           | yes         |                |
| heyra-marketing    | skills      | all           | all         |                |
| heyra-email        | yes         | yes           | yes         |                |
| heyra-meetings     | yes         | yes           | yes         |                |
| heyra-sales        | yes         | yes           | yes         |                |
| heyra-back-office  | yes         | yes           | yes         |                |
| heyra-dev          |             |               | yes         | yes            |

"skills" means the plugin's subagent shows greyed out in Chat; everything
else in it works.
