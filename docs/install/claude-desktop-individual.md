# Install for yourself (Claude Desktop, Claude Cowork, claude.ai)

Result: the plugins appear under **Customize > Plugins** for you only,
saved on your computer. No admin, no GitHub account. Works on any paid
plan (Pro, Max, Team, Enterprise); on Team and Enterprise the admin may have
turned parts of this off.

Quotes are from the Help Center article
[Use plugins in Claude](https://support.claude.com/en/articles/13837440-use-plugins-in-claude),
checked September 2026.

## Where plugins show up

"You can install and use plugins in chat on the web, the Chat tab in Claude
Desktop, and Claude Cowork. The skills bundled in a plugin work across all
three. Hooks and sub-agents run only in Cowork, so they appear grayed out
in chat."

## Path A: add the marketplace in Cowork (30 seconds)

1. Open Claude Desktop, switch to **Cowork**.
2. Open the **Customize** menu, go to the **Plugins** tab.
3. **Add marketplace > Add from a repository**.
4. Enter `Heyra-Global/demo-plugin-marketplace` (or the full URL
   `https://github.com/Heyra-Global/demo-plugin-marketplace`). The
   repository is public, so no sign-in is needed.
5. The marketplace `heyra-demo` appears with six plugins. Install the ones
   you want: heyra-email and heyra-meetings for daily work, heyra-marketing
   for communications, heyra-sales, heyra-back-office, heyra-dev for
   developers.
6. Later, press **Update** on the marketplace to pull new versions.

## Path B: upload a plugin file (no marketplace)

For Claude Chat on the web, or when you received a `.plugin` file.

1. Download the `.plugin` file you want from the
   [releases page](https://github.com/Heyra-Global/demo-plugin-marketplace/releases),
   for example `heyra-email.plugin`.
2. **Customize > Plugins**, choose the option to upload a custom plugin file
   ("You can also upload a custom plugin file if you built one yourself.").
3. Pick the file. The plugin is installed and enabled for you.

"On Claude Desktop and in Cowork, plugins you add yourself are saved
locally to your computer."

## Path C: a colleague shared it with you

If your organisation allows sharing, a plugin a colleague shared appears in
the **Shared with you** section of your Plugins tab, "grayed out until they
enable it". Click it to enable. You get the sharer's current version.

## After installing: connectors

1. **Customize > Connectors**. Turn on **Microsoft 365** and grant mail,
   calendar and files. The email, meeting and back-office skills now read
   your own data.
2. Plugins that declare remote services (Fireflies for transcripts, HubSpot
   as CRM, Atlassian for Jira and Confluence) list them as connectors.
   Connect them only if you use those services. Every skill works without
   them: paste the text instead.

## Try it

In Chat (web or the Chat tab):

```text
Hvad er Heyras farver, og må jeg bruge gul tekst på den lyse baggrund?
Tjek denne annonce: "Vind 30 millioner i aften! Sidste chance! Spil nu!"
Her er en mail fra en spiller, der vil lukke sin konto. Hvad gør jeg?
```

In Cowork, the skills are also slash commands:

```text
/heyra-email:inbox-triage
/heyra-meetings:meeting-minutes
/heyra-marketing:compliance-check
```

## Manage

- Disable or remove a plugin: **Customize > Plugins**, open the plugin's
  menu.
- Plugins installed by your organisation cannot be edited or, if marked
  Required, removed: "You can uninstall auto-installed plugins if you don't
  need them, but required plugins can't be removed."
- Your own copies live on your computer. Another computer needs its own
  install.

## Notes

- Cowork on the web and on mobile is in beta and may need admin enablement
  on Enterprise. Claude Desktop on macOS and Windows has Cowork on all paid
  plans; keep the app updated.
- A marketplace you add yourself is outside your admin's control. For a
  company rollout, see the [admin guide](claude-enterprise-admin.md).
