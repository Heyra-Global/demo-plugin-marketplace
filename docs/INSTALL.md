# Rollout guide: Claude Enterprise with Chat and Cowork

How a company on Claude Enterprise (or Team) gets this marketplace to its
employees, who use Claude Chat and Claude Cowork through Claude Desktop and
the web, and do not use Claude Code.

Written September 2026 from the Claude Help Center articles linked at the
end. Quotes are verbatim. Anthropic changes these products often; check the
articles before a rollout.

Step-by-step guides per surface are in [install/](install/README.md):
[Enterprise admin](install/claude-enterprise-admin.md),
[individual in Claude Desktop or claude.ai](install/claude-desktop-individual.md),
[GitHub Copilot](install/github-copilot.md), [Claude Code](install/claude-code.md).

## The short answer

| Who                          | What they do                                                                 | GitHub access needed          |
| ---------------------------- | ---------------------------------------------------------------------------- | ----------------------------- |
| One Claude admin (Owner or Primary Owner) | Adds the marketplace once in **Organization settings > Plugins**, sets which plugins are installed for whom, turns on auto-update | Yes, admin access to the repository, once |
| Every employee               | Nothing. The plugins appear under **Customize > Plugins** in Chat and Cowork | **No**                         |
| Two or three plugin owners   | Maintain the repository: edit skills, bump versions, merge pull requests     | Yes                            |

Employees never see GitHub. The organisation marketplace syncs through the
Claude GitHub App, not through each user's account. The Help Center on the
admin's role: "Your personal GitHub token is verified to confirm you have
access, then Cowork uses its GitHub App installation token for sync
operations."

## Recommendation

1. Use the **organisation marketplace with GitHub sync**. One admin action,
   version control, automatic updates, admin control over who gets what.
2. Set `heyra-essentials` to **Required**: general skills for everyone,
   no connectors, nothing to opt out of. Set the five business plugins to
   **Installed by default**. Every employee gets them at the next session
   and can turn one off if they do not need it.
3. Set `heyra-dev` to **Available for install**, or use an Enterprise group
   for developers with **Installed by default**.
4. Turn on **automatic updates** for the marketplace, so a merged pull
   request with a version bump reaches everyone without a second admin
   action.
5. Turn on **skill and plugin sharing** for members, so employees can build
   their own plugins in Cowork and share them with colleagues while the
   plugin owners decide what goes into the company marketplace. See
   [Contributing without a code editor](CONTRIBUTE-WITHOUT-CODE.md).
6. Keep **security scanning** on (Enterprise), which checks uploaded skills
   and plugins.

## Admin setup, step by step

Prerequisites (from the Help Center): "Cowork and Skills must both be
enabled for your organization before you can use plugin marketplaces."
The repository "must be private or internal—public repos aren't allowed
for organization marketplaces." "The person turning the toggle on must have
admin-level access to that repository on GitHub." "Make sure the Claude
GitHub App is installed in that repository."

1. Copy this repository into the company's GitHub organisation as a
   private repository (**Use this template** on GitHub is the quickest).
   Install the Claude GitHub App on it.
2. In claude.ai, open **Organization settings > Plugins**.
3. **Add plugins > GitHub**, enter the repository as `owner/repo`. The
   initial sync runs at once.
4. For each plugin, choose one of the four states:
   - **Installed by default**: "Automatically installed for all org members"
   - **Available for install**: "Listed in the plugin catalog"
   - **Required**: "Automatically installed without option to remove"
   - **Not available**: "Hidden from the catalog entirely"
5. Enterprise only: override per group. "If a member belongs to two or more
   groups with different settings for the same plugin, the most permissive
   setting applies."
6. Opt in to automatic updates for the marketplace.

Changes reach members at their next session or plugin refresh.

## What employees see and do

- The plugins are listed under **Customize > Plugins** in chat on the web,
  in the Chat tab of Claude Desktop, and in Cowork. "Plugins you distribute
  appear in both chat (on the web and the Chat tab in Claude Desktop) and
  Claude Cowork."
- Skills work everywhere. "Hooks and sub-agents run only in Cowork, so they
  appear grayed out in chat." In this marketplace the only subagent is the
  marketing reviewer; everything else is skills.
- Connectors are personal. An employee turns on Microsoft 365 under
  **Customize > Connectors** once; the email, meeting and back-office skills
  then read their own mail, calendar and files. Every skill also works with
  pasted text.
- Employees cannot change the company's plugins: "Members can't edit
  organization-managed plugins, which prevents conflicting changes to shared
  tooling." They can add their own plugins next to them, which are "saved
  locally to your computer".

## Updates

GitHub sync: "automatic sync runs when a pull request that includes a
plugin version bump is merged to the repository's default branch." The
plugin owners' workflow is therefore: change the files, bump the version in
the plugin manifest and both marketplace files, open a pull request, let
CI pass, merge. Nothing to do in the admin console.

Manual marketplace: "To update a plugin, upload a new ZIP file with the same
plugin name. The new version overwrites the existing one automatically."

## The other paths, and when to use them

| Path                                        | Who         | GitHub needed | Reach                       | Use it when                                                        |
| ------------------------------------------- | ----------- | ------------- | --------------------------- | ------------------------------------------------------------------ |
| Organisation marketplace, GitHub sync       | Admin       | Admin only    | Whole org, by group          | The normal case. Recommended                                        |
| Organisation marketplace, ZIP upload        | Admin       | No            | Whole org, by group          | The company does not use GitHub, or for a quick pilot. ZIP up to 50 MB, up to 100 plugins. Re-upload to update |
| Cowork **Add marketplace > Add from a repository** | Any user | No (this repository is public) | That user's machine | A personal install or test; a public demo marketplace like this one |
| Cowork or Chat **upload a custom plugin file** (`.plugin` zip) | Any user | No | That user's machine  | Trying a plugin someone sent you; plugins you built yourself        |
| **Share** from Customize > Plugins           | Any user, if the admin allowed sharing | No | The colleagues you pick | Team-level tools before they are promoted to the org marketplace   |

The `.plugin` files for this marketplace are attached to every GitHub
release and to every CI run, and `python scripts/package-plugins.py`
rebuilds them into `dist/`.

## Questions we expect

**Do employees need a GitHub account?** No. Only the admin who connects the
repository and the plugin owners who edit it.

**Can we keep the repository private and still roll it out?** Yes. That is
the required setup for an organisation marketplace. The repository must be
private or internal.

**This demo repository is public. Can the admin connect it directly?** No.
Make a private copy under the company's GitHub organisation (**Use this
template** on GitHub, a git mirror, or GitHub Import; steps in the
[admin guide](install/claude-enterprise-admin.md)), or upload the `.plugin`
files.

**Can an employee install the marketplace themselves?** In Cowork, yes:
Customize > Plugins > Add marketplace > Add from a repository >
`Heyra-Global/demo-plugin-marketplace`, or from a `.plugin` file. That copy
is local to their machine and outside admin control. For the company
rollout, use the organisation marketplace.

**Can employees create or change plugins without Claude Code?** Yes. See
[Contributing without a code editor](CONTRIBUTE-WITHOUT-CODE.md).

**Where does company data go?** Plugins are text files. Data flows only
through the connectors an employee turns on, under the organisation's
connector policy. Custom connectors must be reachable from Anthropic's
cloud: "A custom connector must point to a server that's reachable over the
public internet from Anthropic's IP ranges."

**How many plugins can a marketplace hold?** "Max plugin ZIP size (upload):
50 MB | Max plugins per marketplace (manual): 100 | Max plugins per
marketplace (GitHub sync): 500".

## Sources

- Manage plugins for your organization: https://support.claude.com/en/articles/13837433-manage-plugins-for-your-organization
- Use plugins in Claude: https://support.claude.com/en/articles/13837440-use-plugins-in-claude
- Use Claude Cowork on Team and Enterprise plans: https://support.claude.com/en/articles/13455879-use-claude-cowork-on-team-and-enterprise-plans
- Provision and manage skills for your organization: https://support.claude.com/en/articles/13119606-provision-and-manage-skills-for-your-organization
- Cowork plugins guide: https://claude.com/docs/cowork/guide/plugins
