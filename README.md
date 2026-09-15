# Heyra demo plugin marketplace

A demo plugin marketplace by [Heyra](https://heyra.io) for companies that
use **Claude Chat** and **Claude Cowork** on a Claude Enterprise or Team
plan, and **GitHub Copilot** for their developers. Five plugins for
non-developers, one for developers, all about one fictional company, all
installable from this repository.

> **Demo content.** "Heyra" is used here as the name of an invented Danish
> betting and gaming operator. Its products, people, policies, numbers and
> brand are fiction. The Danish gambling-marketing rules referenced in the
> marketing plugin are real and summarised for the demo; they are not legal
> advice.

## What a marketplace is

A marketplace is a git repository with one file,
`.claude-plugin/marketplace.json`, that lists plugins. A plugin is a folder
with a `.claude-plugin/plugin.json` manifest, `skills/` and optionally
connectors and subagents. A Claude admin adds the marketplace once in the
organisation settings; every employee then sees the plugins in Claude Chat
and Claude Cowork. Developers add the same repository in Claude Code or
GitHub Copilot.

## The plugins

| Plugin                                           | For                        | What it does                                                                           | Chat | Cowork | Claude Code | Copilot |
| ------------------------------------------------ | -------------------------- | -------------------------------------------------------------------------------------- | :--: | :----: | :---------: | :-----: |
| [heyra-marketing](plugins/heyra-marketing/)      | Marketing, communications  | Brand voice, campaign brief, social post, press release, Danish gambling-ad compliance check | yes | yes | yes |    |
| [heyra-email](plugins/heyra-email/)              | Everyone with an inbox     | Inbox triage, replies in your voice, thread summary, follow-ups. Outlook               | yes  | yes    | yes         |         |
| [heyra-meetings](plugins/heyra-meetings/)        | Managers, project leads    | Meeting prep, minutes, action tracker, weekly status                                    | yes  | yes    | yes         |         |
| [heyra-sales](plugins/heyra-sales/)              | Partner and retail sales   | Account research, offers, follow-up mail, pipeline review                                | yes  | yes    | yes         |         |
| [heyra-back-office](plugins/heyra-back-office/)  | Finance, HR, legal         | Invoice check, expense policy, job description, onboarding, handbook, contracts, GDPR   | yes  | yes    | yes         |         |
| [heyra-dev](plugins/heyra-dev/)                  | Developers                 | Commit, PR, review, doctor, setup, guard hooks, LSP, docs MCP. Two manifest formats     |      |        | yes         | yes     |

Skills work in every Claude surface. The one subagent (in heyra-marketing)
runs in Cowork and Claude Code; Claude Chat shows it greyed out. Hooks exist
only in heyra-dev.

## Install

The full rollout guide for a company on Claude Enterprise is in
[docs/INSTALL.md](docs/INSTALL.md). The short version: one Claude admin
adds the marketplace once in Organization settings; employees need no
GitHub account and install nothing; two or three plugin owners maintain
the repository. Employees can build and share their own plugins from Cowork
without Claude Code, see
[docs/CONTRIBUTE-WITHOUT-CODE.md](docs/CONTRIBUTE-WITHOUT-CODE.md).

### Claude Enterprise or Team admin (everyone gets the plugins)

Requirements: Cowork and Skills enabled for the organisation, and an Owner
or Primary Owner role.

1. Organization settings > **Plugins** > **Add plugins** > **GitHub**.
2. Enter `Heyra-Global/demo-plugin-marketplace`. The repository must be
   **private or internal** for an organisation marketplace; fork this one
   into your organisation if it is public at the time.
3. Set each plugin to *Installed by default*, *Available for install*,
   *Required* or *Not available*. Enterprise groups can get different
   settings.
4. Members see the plugins under **Customize > Plugins** in Chat and Cowork
   at their next session.

Alternative without GitHub: **Add plugins > Upload a file** with the
`.plugin` zips from `dist/` (built by `python scripts/package-plugins.py`,
also attached to every CI run).

### Claude Cowork, one user

**Plugins** > **Add marketplace** > `Heyra-Global/demo-plugin-marketplace`.
This path works with a public repository. For a private one, upload the
`.plugin` file from `dist/` instead. Turn on the Microsoft 365 connector
under **Customize > Connectors** to let the email and meeting skills read
your mail and calendar.

### Claude Code

```bash
claude plugin marketplace add Heyra-Global/demo-plugin-marketplace
claude plugin install heyra-dev@heyra-demo --scope user
claude plugin install heyra-email@heyra-demo --scope user
```

### GitHub Copilot

```bash
copilot plugin marketplace add Heyra-Global/demo-plugin-marketplace
copilot plugin install heyra-dev@heyra-demo
```

VS Code: add the repository to the `chat.plugins.marketplaces` setting.
Copilot cloud agent and teams: commit `.github/copilot/settings.json` (this
repository has one). Copilot Business and Enterprise: `copilot/managed-settings.json`
in the organisation's `.github-private` repository.

## What a plugin contains

| Component                              | heyra-marketing | heyra-email | heyra-meetings | heyra-sales | heyra-back-office | heyra-dev |
| -------------------------------------- | :-------------: | :---------: | :------------: | :---------: | :---------------: | :-------: |
| Reference skill Claude loads on its own | brand-voice    | email-style | minutes-format | partner-playbook | expense-policy | tdd     |
| Task skills (slash commands in Cowork) | 4               | 4           | 4              | 4           | 6                 | 5         |
| Bundled templates and references       | yes             | yes         |                | yes         | yes               |           |
| Danish examples                        | yes             | yes         | yes            | yes         | yes               |           |
| Connectors (`CONNECTORS.md`)           | M365, Teams, Canva | M365     | M365, Fireflies | M365, HubSpot | M365, Atlassian |           |
| Remote MCP server in `.mcp.json`       |                 |             | Fireflies      | HubSpot     | Atlassian         | Context7, Playwright |
| Subagent                               | yes             |             |                |             |                   | 2 (+2 Copilot format) |
| Hooks                                  |                 |             |                |             |                   | 4         |
| LSP servers                            |                 |             |                |             |                   | 2         |
| Agent Plugins 1.0 manifest (Copilot)   |                 |             |                |             |                   | yes       |
| Eval suite (`claude plugin eval`)      | yes             |             |                |             |                   |           |

## Repository layout

```
.claude-plugin/marketplace.json   the marketplace (Claude Chat, Cowork, Claude Code, Copilot)
.github/plugin/marketplace.json   identical copy at Copilot's default location (CI checks equality)
.github/copilot/settings.json     pins the marketplace for Copilot users of this repo
.claude/settings.json             pins the marketplace and the plugin-authoring stack for Claude Code
plugins/<name>/                   one folder per plugin, each with its own README
templates/plugin-template/        copy this to start a new plugin
scripts/                          house-rule validator, hook tests, packager, validate-all
docs/INSTALL.md                   rollout guide for Claude Enterprise: admin, employees, plugin owners
docs/CONTRIBUTE-WITHOUT-CODE.md   how employees add and change plugins from Chat and Cowork
docs/HEYRA.md                     the fictional company, for presenters and contributors
docs/DEMO.md                      presenter script, 30 minutes
docs/ARCHITECTURE.md              formats and where each component works
CONTRIBUTING.md                   how to add or change a plugin
.github/workflows/validate.yml    CI: syntax, house rules, hook tests, claude plugin validate, packaging
```

## Validate and test

```bash
bash scripts/validate-all.sh          # everything CI runs, plus dist/*.plugin
python scripts/check-marketplace.py   # house rules only
claude plugin validate --strict .     # official validator
claude --plugin-dir ./plugins/heyra-email   # try a plugin in Claude Code without installing
```

`claude plugin eval plugins/heyra-marketing --runs 1` runs the eval case;
the command is in early access and may print "early access" on accounts
without it.

## Further reading

- [Rollout guide for Claude Enterprise](docs/INSTALL.md)
- [Contributing without a code editor](docs/CONTRIBUTE-WITHOUT-CODE.md)
- [The fictional company](docs/HEYRA.md)
- [Presenter script](docs/DEMO.md)
- [Architecture and formats](docs/ARCHITECTURE.md)
- Anthropic: [Use plugins in Claude](https://support.claude.com/en/articles/13837440-use-plugins-in-claude),
  [Manage plugins for your organization](https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization),
  [Cowork plugins guide](https://claude.com/docs/cowork/guide/plugins),
  [Knowledge-work plugins](https://github.com/anthropics/knowledge-work-plugins),
  [Claude Code plugins reference](https://code.claude.com/docs/en/plugins-reference)
- GitHub: [Copilot CLI plugins](https://docs.github.com/en/copilot/concepts/agents/copilot-cli/about-cli-plugins),
  [Agent Plugins 1.0](https://agent-plugins.org/specification),
  [Agent Skills](https://agentskills.io/specification)
