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

## The one-line version

| Surface                     | Command or click path                                                                          |
| --------------------------- | ---------------------------------------------------------------------------------------------- |
| Claude Enterprise admin     | Organization settings > Plugins > Add plugins > GitHub > `<your-org>/<private-copy-of-this-repo>` |
| Claude Cowork, one user     | Customize > Plugins > Add marketplace > Add from a repository > `Heyra-Global/demo-plugin-marketplace` |
| Claude Chat or Cowork, one user, no marketplace | Customize > Plugins > upload a `.plugin` file from the [releases page](https://github.com/Heyra-Global/demo-plugin-marketplace/releases) |
| GitHub Copilot CLI          | `copilot plugin marketplace add Heyra-Global/demo-plugin-marketplace` then `copilot plugin install heyra-dev@heyra-demo` |
| VS Code with Copilot        | Setting `chat.plugins.marketplaces`: add `Heyra-Global/demo-plugin-marketplace`                 |
| Claude Code                 | `claude plugin marketplace add Heyra-Global/demo-plugin-marketplace` then `claude plugin install heyra-email@heyra-demo` |

## Which plugins work where

| Plugin             | Claude Chat | Claude Cowork | Claude Code | GitHub Copilot |
| ------------------ | :---------: | :-----------: | :---------: | :------------: |
| heyra-marketing    | skills      | all           | all         |                |
| heyra-email        | yes         | yes           | yes         |                |
| heyra-meetings     | yes         | yes           | yes         |                |
| heyra-sales        | yes         | yes           | yes         |                |
| heyra-back-office  | yes         | yes           | yes         |                |
| heyra-dev          |             |               | yes         | yes            |

"skills" means the plugin's subagent shows greyed out in Chat; everything
else in it works.
