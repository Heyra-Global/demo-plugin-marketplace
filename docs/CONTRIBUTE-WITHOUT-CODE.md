# Contributing without a code editor

How an employee who works in Claude Chat and Claude Cowork, and never opens
Claude Code or GitHub, adds a plugin or improves an existing one.

A plugin is a folder of text files. The skills inside are instructions
written in plain language. Anyone who can write a good work instruction can
write a skill. The steps below go from "for me" to "for the company".

## Level 1: a plugin for yourself

Anthropic ships a plugin for this. In Cowork, open **Customize > Plugins >
Add marketplace > Browse Anthropic sources**, and install **Plugin Create**
(the `cowork-plugin-management` plugin in the Knowledge Work marketplace).
The Help Center: "The 'Plugin Create' plugin walks you through the process,
and you can start from any Anthropic-built template and modify it."

Then ask Cowork, in your own words:

```text
Lav et plugin til vores kundecenter med et skill, der skriver svar på
udbetalingsspørgsmål efter vores retningslinjer. Her er retningslinjerne: ...
```

Plugin Create runs a guided conversation (discovery, planning, design,
implementation, packaging) and delivers a `<name>.plugin` file. Its own
instructions say the file "will appear in the chat as a rich preview where
the user can browse the files and accept the plugin by pressing a button".
That button installs it. A `.plugin` file received from someone else is
added under **Customize > Plugins** with the upload option: "You can also
upload a custom plugin file if you built one yourself." Either way it is
stored on your computer: "On Claude Desktop and in Cowork, plugins you add
yourself are saved locally to your computer."

For a single skill without a plugin, **Customize > Skills** lets you create
one directly, if the admin allowed user-created skills.

Test it in Chat and Cowork with real prompts. Fix the wording until it
does what you want. Rules that make skills work:

- Say what the skill does, then "Use when ...", in the description.
- Give steps, hard rules and an output format.
- Never let it send, delete or invent. It drafts and asks.
- Keep personal data out of what it writes.

## Level 2: a plugin for your team

If the admin turned on sharing ("Owners and Primary Owners of Team and
Enterprise organizations can turn on skill and plugin sharing for
members"), open the plugin's menu under **Customize > Plugins** and choose
**Share**. Colleagues find it under **Shared with you**, "grayed out until
they enable it". "The people you share with get your current version, and
you can stop sharing at any time."

Use this for a few weeks. If the team keeps using it, promote it.

## Level 3: a plugin for the company

The company marketplace is a GitHub repository maintained by two or three
**plugin owners**. Employees do not need access to it. To get a plugin in:

1. Send the plugin owners the `.plugin` file (or the folder) with the
   handover note below, for example in the Teams channel the owners named.
2. A plugin owner unpacks it into `plugins/<name>/`, runs the checks, adds
   it to the marketplace file, and opens a pull request. CI validates it.
3. After the merge, the marketplace syncs on its own and the plugin shows
   up for everyone the admin allowed, at their next session.

Handover note (copy and fill in):

```text
Plugin name: <lowercase-with-hyphens>
One sentence: what it does and for whom
Owner in the business: <name, department>
Connectors it uses: <Microsoft 365 mail / files / none>
Three test prompts that must work:
1. ...
2. ...
3. ...
Contains personal or client data: no (it must not)
```

## Changing a plugin that is already in the marketplace

Employees cannot edit organisation-managed plugins: "You can't edit
organization-managed plugins. This keeps shared tooling consistent across
your team." Propose the change instead:

1. Copy the current skill text (ask Claude: "Vis mig teksten i skillet
   inbox-triage") and edit it in Cowork, or describe the change in plain
   words.
2. Send it to the plugin owners with the plugin name, the skill name and
   one test prompt that shows the improvement.
3. The owner applies it, bumps the version, opens a pull request, merges.
   Everyone gets it at the next session.

## Runbook for plugin owners

```bash
# 1. Unpack the handover into the repository
mkdir -p plugins/<name> && cd plugins/<name> && unzip ~/Downloads/<name>.plugin && cd ../..

# 2. Check the shape, the descriptions and the fiction and data rules
python scripts/check-marketplace.py

# 3. Register the plugin in .claude-plugin/marketplace.json (name, source, description, version, category),
#    then copy the file to Copilot's location
cp .claude-plugin/marketplace.json .github/plugin/marketplace.json

# 4. Run everything CI runs
bash scripts/validate-all.sh

# 5. Branch, commit, pull request
git checkout -b feat/<name>
git add -A && git commit -m "feat(<name>): add <name> plugin"
git push -u origin feat/<name>
```

For a change to an existing plugin: edit, bump `version` in
`plugins/<name>/.claude-plugin/plugin.json` and in both marketplace files,
validate, pull request. The version bump is what triggers the automatic
sync.

## What is not possible from Chat and Cowork

- Editing the organisation's plugins in place.
- Pushing to the GitHub repository without access to it.
- Running scripts or hooks in Chat. Skills in Chat are instructions only,
  which is all the business plugins need.
