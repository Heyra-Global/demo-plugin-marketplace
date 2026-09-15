# Presenter script

A 30-minute walkthrough for a company on Claude Enterprise whose employees
use Claude Chat and Claude Cowork, and whose developers use GitHub Copilot.
Each step has what to type and the point to make.

## Before the session

- A Claude Enterprise or Team organisation where you are Owner, with Cowork
  and Skills enabled, and Claude Desktop with Cowork on the demo machine.
- The marketplace added to the organisation (Organization settings >
  Plugins > Add plugins > GitHub, private or internal repository) with the
  six plugins set to *Installed by default*. Fallback: upload the `.plugin`
  files from `dist/` (`python scripts/package-plugins.py`). The step-by-step
  admin flow is in `docs/INSTALL.md`.
- Microsoft 365 connected under Customize > Connectors on the demo account,
  with a demo mailbox that contains a few prepared mails: one from a
  colleague with a deadline, one from a "player" asking to close an
  account, one newsletter.
- A folder with two pages of meeting notes and last week's minutes.
- Optional, for the developer segment: a laptop with Copilot CLI and a
  small git repository.
- Open `docs/HEYRA.md` for the one-breath answer to "who is Heyra".

## 1. What you are looking at (3 min)

Show the repository's `.claude-plugin/marketplace.json` and one plugin
folder.

> A marketplace is a git repository with a list. A plugin is a folder with
> skills: Markdown files that hold how your company does something. Your
> admin adds the repository once. Every employee gets the plugins in Claude
> Chat and Cowork. No installs, no scripts, no IT ticket per person.

Show Organization settings > Plugins.

> Installed by default, available, required, or hidden, per group. Same
> control you have over connectors. And the same repository serves your
> developers in Copilot; we come to that at the end.

## 2. Claude Chat: the brand knows the rules (5 min)

Optional opener, in Claude Chat with heyra-essentials on:

```text
/ama Jeg skal lave en præsentation til ledelsen om kundecentret.
```

> Claude asks a round of multiple-choice questions before it writes a
> word. That is a skill every employee has. Requests get clearer, answers
> get better, nobody had to learn prompting.

In Claude Chat, with heyra-marketing on:

```text
Hvad er Heyras farver, og må jeg bruge gul tekst på den lyse baggrund?
```

> Claude loaded the brand skill on its own. Nobody typed a command. The
> answer has the exact hex values and the contrast rule.

```text
Tjek denne annonce: "Vind 30 millioner i aften! Sidste chance! Spil nu!"
```

> This is the compliance check. Age mark missing, helpline missing, ROFUS
> missing, "sidste chance" is pressure, and the amount is presented as the
> reason to play. Every finding has the rule and the fix. The team gets a
> table in seconds; legal still signs. Then ask for the corrected version.

```text
Skriv et Facebook-opslag om lørdagens Ugens Tal-trækning. Puljen er 30 mio. kr.
```

> Notice the last line. The mandatory block is there because the skill
> says it must be. That is the difference between a chatbot and a plugin.

## 3. Cowork: the inbox (6 min)

Switch to Cowork with heyra-email on and Microsoft 365 connected.

```text
Gå min indbakke igennem siden i går.
```

> Triage in the house categories. Look at the "player" mail: it is marked
> Redirect, same day, forward to the responsible-gaming team, no marketing
> in the reply. The plugin encodes a rule a new employee would not know on
> day one.

```text
Svar Karin, at vi kan levere plakaterne fredag. Kort og venligt.
```

> Drafted in the user's voice, answer first, saved as an Outlook draft.
> Nothing is sent. The plugin never sends.

```text
Hvad venter jeg på svar på fra de sidste syv dage?
```

## 4. Cowork: the meeting (4 min)

Point Cowork at the folder with notes and minutes, heyra-meetings on.

```text
Skriv et referat fra mine noter fra styregruppemødet i går.
```

> Numbered decisions, an action table with one owner and a date each, the
> classification label. Saved next to last week's minutes on request.

```text
Hvilke actions er overskredet?
```

> It read every minutes file in the folder. Reminders drafted per person.

## 5. Back office: the request nobody wants (3 min)

With heyra-back-office on:

```text
En spiller skriver "slet alle mine data". Hvad gør jeg?
```

> A licensed operator cannot simply delete: anti-money-laundering and
> self-exclusion records must be kept. The skill knows that, sets the
> one-month deadline, lists the systems, and drafts the partial-erasure
> reply with the legal basis. The case handler gets a procedure, not a
> guess.

One more, fast:

```text
Må jeg give en forhandler en julegave til 1.500 kr.?
```

## 6. Partners (2 min)

With heyra-sales on:

```text
Lav et tilbud til Roskilde Håndbold på en Sølv-sponsorpakke.
```

> Prices from the playbook, the compliance clauses that every offer must
> carry, and nothing that the gambling licence forbids. The playbook is a
> Markdown file the sales lead owns.

## 7. Governance (3 min)

Back to Organization settings.

> Plugins are versioned in git. A change is a pull request; the marketplace
> syncs when it merges. Security scanning checks uploaded plugins. Groups
> decide who sees what. Members cannot edit the organisation's plugins.
> Audit and compliance APIs cover Cowork on Enterprise.

> Nobody except one admin and the plugin owners needs a GitHub account.
> Employees get the plugins from Claude, not from GitHub. And an employee
> who wants a plugin of their own builds it in Cowork with Plugin Create,
> shares it with the team, and hands it to the plugin owners when it has
> proven itself. The rollout guide and the no-code contribution guide are in
> the repository.

Show `.github/workflows/validate.yml`.

> The repository has CI: the same checks a software team runs, for the
> company's knowledge.

## 8. Developers: the same repository in Copilot (4 min)

On the developer laptop:

```bash
copilot plugin marketplace add Heyra-Global/demo-plugin-marketplace
copilot plugin install heyra-dev@heyra-demo
copilot
```

Then in the session: `/heyra-dev:commit`, and try `git push --force origin main`.

> Same repository, same plugin folder. Copilot reads the plugin, the skill
> ran as a slash command, and the guard hook blocked the force-push. Two
> manifests in one folder make it work in Claude Code and Copilot alike.
> Nobody at the company maintains two sets of knowledge.

If there is no Copilot laptop, show `plugins/heyra-dev/` in the editor and
the install lines in its README.

## Closing (1 min)

> Skills carry how you work. Connectors carry your data. A marketplace
> ships both to everyone in one place, with version control and admin
> control. Which team's way of working would you put in a plugin first?

## If something breaks

- Plugin not visible in Chat or Cowork: check the plugin's state in
  Organization settings > Plugins, then Customize > Plugins on the account.
  Members see changes at their next session.
- Connector says no access: Customize > Connectors, reconnect Microsoft
  365, grant mail and calendar.
- Skill not triggering: name it in the prompt ("brug compliance-check").
- Nothing loads: fall back to Chat with pasted text. Every business skill
  works without connectors.
- Marketplace sync fails: the repository must be private or internal, with
  the Claude GitHub App installed; otherwise upload the `.plugin` zip.
