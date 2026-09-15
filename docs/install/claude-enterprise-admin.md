# Install for a whole organisation (Claude Enterprise or Team admin)

Result: every employee sees the plugins under **Customize > Plugins** in
Claude Chat (web and Claude Desktop) and in Claude Cowork. Employees install
nothing and need no GitHub account.

Quotes are from the Claude Help Center article
[Manage plugins for your organization](https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization),
checked September 2026.

## Before you start

| Requirement                                  | Why                                                                                             |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| You are an Owner or Primary Owner            | "Owners and Primary Owners of Team and Enterprise plans can manage organization plugins"         |
| Cowork and Skills are enabled for the org    | "Cowork and Skills must both be enabled for your organization before you can use plugin marketplaces" |
| A **private or internal** copy of this repository in your company's GitHub | "Your repository must be private or internal—public repos aren't allowed for organization marketplaces" |
| You have admin access to that repository     | "The person turning the toggle on must have admin-level access to that repository on GitHub"     |
| The Claude GitHub App is installed on it     | "Make sure the Claude GitHub App is installed in that repository"                                |

No GitHub at all in the company? Skip to [Path B: upload the plugin files](#path-b-upload-the-plugin-files).

## Step 0: make a private copy of this repository

This repository is public so anyone can read and try it. An organisation
marketplace needs a private copy under your own GitHub organisation. Three
ways, pick one:

**Use this template (GitHub web, no git needed)**

1. Open https://github.com/Heyra-Global/demo-plugin-marketplace.
2. Click **Use this template > Create a new repository**.
3. Owner: your organisation. Name: `claude-plugins` or similar. Visibility:
   **Private** (or Internal on GitHub Enterprise). Create.

**Mirror with git (keeps the history)**

```bash
git clone --bare https://github.com/Heyra-Global/demo-plugin-marketplace.git
cd demo-plugin-marketplace.git
git push --mirror https://github.com/<your-org>/claude-plugins.git   # create the private repo first
```

**GitHub Import**: New repository > Import a repository > paste the URL,
choose Private.

Afterwards, install the Claude GitHub App on the new repository (GitHub:
Settings > GitHub Apps, or the prompt Claude shows when you connect it).

## Path A: connect the repository (recommended)

1. In claude.ai, open **Organization settings > Plugins**.
2. **Add plugins > GitHub**.
3. Enter the repository as `<your-org>/<repo>` and confirm. Your GitHub
   access is checked once: "Your personal GitHub token is verified to
   confirm you have access, then Cowork uses its GitHub App installation
   token for sync operations." Members are never asked for GitHub.
4. "An initial sync runs automatically when you connect a repository."
   The six plugins appear in the list.
5. For each plugin choose the state. Recommended:

   | Plugin            | State                    | Why                                                       |
   | ----------------- | ------------------------ | --------------------------------------------------------- |
   | heyra-essentials  | Required                 | General skills for everyone (`/ama`, `plugin-help`); no connectors, nothing to opt out of |
   | heyra-email       | Installed by default     | Useful to everyone with an inbox                           |
   | heyra-meetings    | Installed by default     | Useful to everyone who runs meetings                        |
   | heyra-marketing   | Installed by default, or Available | Marketing and communications; others may like the brand voice |
   | heyra-sales       | Available for install    | Partner teams                                              |
   | heyra-back-office | Available for install    | Finance, HR, legal                                          |
   | heyra-dev         | Available for install, or Installed by default for a developer group | Developers          |

   The four states: "Installed by default: Automatically installed for all
   org members. Available for install: Listed in the plugin catalog. Not
   available: Hidden from the catalog entirely. Required: Automatically
   installed without option to remove."

6. Enterprise only, optional: override the state per group. "If a member
   belongs to two or more groups with different settings for the same
   plugin, the most permissive setting applies."
7. Turn on automatic updates for this marketplace. "Once enabled, automatic
   sync runs when a pull request that includes a plugin version bump is
   merged to the repository's default branch."

## Path B: upload the plugin files

For a pilot, or when the company does not use GitHub.

1. Download the six `.plugin` files from the
   [releases page](https://github.com/Heyra-Global/demo-plugin-marketplace/releases)
   (or build them with `python scripts/package-plugins.py`).
2. **Organization settings > Plugins > Add plugins > Upload a file**, then
   **Upload to a new marketplace** for the first file and to that
   marketplace for the rest. Limits: "Max plugin ZIP size (upload): 50 MB |
   Max plugins per marketplace (manual): 100".
3. Set the states as in Path A.
4. To update later: "upload a new ZIP file with the same plugin name. The
   new version overwrites the existing one automatically."

## Connectors and policies

- Members turn on **Microsoft 365** themselves under **Customize >
  Connectors**. The email, meeting and back-office skills then read their
  own mail, calendar and files. Nothing to do centrally, unless your
  connector policy restricts it.
- Three plugins declare remote connectors (Fireflies, HubSpot, Atlassian).
  Members see them and can connect if the company uses those services.
  Remove the `.mcp.json` entry in your copy if not.
- **Organization settings > Skills > Policy**: turn on skill and plugin
  sharing if you want employees to share their own plugins with colleagues.
- Enterprise: security scanning of uploaded skills and plugins is on by
  default; keep it on.

## Verify

1. Sign in as a normal member (or ask one). Open **Customize > Plugins**.
   The default-installed plugins are listed and enabled.
2. In Chat, type: `Hvad er Heyras farver?` The brand-voice skill answers
   with the hex values.
3. In Cowork, type: `/heyra-email:inbox-triage` or `Gå min indbakke
   igennem siden i går.` with Microsoft 365 connected.
4. Members who cannot see the plugins yet: "Changes take effect on each
   member's next session or plugin refresh."

## Update the plugins later

Plugin owners edit the files, bump `version` in the plugin manifest and in
both marketplace files, open a pull request, merge. With automatic updates
on, the marketplace syncs and members get the new version at their next
session. Without automatic updates, press **Sync** on the marketplace in
the admin console.

## Troubleshooting

| Symptom                                       | Cause and fix                                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------------------------- |
| "Repository not found" or sync fails          | The repository is public, the Claude GitHub App is not installed, or you lack admin access on it |
| A plugin is missing in the catalog            | Its state is Not available, or the marketplace has not synced since the plugin was added       |
| A member sees the plugin but cannot edit it   | Expected. "Members can't edit organization-managed plugins"                                    |
| Subagent greyed out in Chat                   | Expected. "Hooks and sub-agents run only in Cowork"                                            |
| A skill does not trigger                      | Ask for it by name, for example "brug compliance-check". Descriptions decide when Claude loads a skill |
