---
name: plugin-help
description:
  Explain which Heyra plugins and skills exist, what each one does, which
  to use for a task, where the plugins and connectors are switched on, and
  how to propose a change or a new plugin. Use when the user asks what
  Claude can do here, which plugins or skills are available, how to use a
  skill, or types "help" or "hjælp". To clarify an unclear task with an
  interview first, see ama.
argument-hint: "[topic, plugin name or task]"
---

# Plugin help

Question or topic: `$ARGUMENTS`

Answer in the user's language. Keep it under 200 words unless the user
asks for the full list. Point to the one skill that fits the task; do not
list everything when one answer will do.

## The Heyra plugins

| Plugin             | For                    | Skills (say the name to use one)                                                                 |
| ------------------ | ---------------------- | ------------------------------------------------------------------------------------------------ |
| heyra-essentials   | Everyone               | `ama` (interview me to clarify a task), `plugin-help` (this)                                      |
| heyra-email        | Everyone with an inbox | `inbox-triage`, `draft-reply`, `thread-summary`, `follow-ups`; house rules in `email-style`       |
| heyra-meetings     | Managers, project leads | `meeting-prep`, `meeting-minutes`, `action-tracker`, `weekly-status`; standard in `minutes-format` |
| heyra-marketing    | Marketing, communications | `social-post`, `campaign-brief`, `press-release`, `compliance-check`; rules in `brand-voice`  |
| heyra-sales        | Partner and retail sales | `account-research`, `partner-offer`, `follow-up-email`, `pipeline-review`; rules in `partner-playbook` |
| heyra-back-office  | Finance, HR, legal     | `invoice-check`, `job-description`, `onboarding-plan`, `policy-lookup`, `contract-summary`, `gdpr-request`; `expense-policy` |
| heyra-dev          | Developers             | `commit`, `pr-description`, `review-changes`, `tdd`, `doctor`, `setup` (Claude Code and GitHub Copilot) |

## How to use a skill

- Ask in plain words. Claude picks the skill from the request: "Gå min
  indbakke igennem" loads `inbox-triage`.
- Or name it. In Cowork the skills are slash commands:
  `/heyra-email:inbox-triage`. In Chat, write "brug inbox-triage".
- Skills that read your mail, calendar or files need the Microsoft 365
  connector: **Customize > Connectors**. Without it, paste the text.
- Skills never send mail, post messages or delete anything. They draft and
  ask.

## Where the plugins are

**Customize > Plugins** in Claude Chat (web and Claude Desktop) and in
Cowork. Plugins the company installed cannot be edited there. A plugin
marked Required cannot be removed; others can be switched off.

## Proposing a change or a new plugin

Employees do not edit the company plugins directly. Describe the change
(plugin, skill, what should be different, one example) and send it to the
plugin owners. For a new plugin, build it in Cowork with Anthropic's
"Plugin Create" plugin, test it, share it with the team, then hand the
`.plugin` file to the plugin owners. They put it in the marketplace, and it
reaches everyone at their next session.

## If something does not work

- The skill did not trigger: name it, or start with the task words the
  description lists.
- A subagent shows greyed out in Chat: expected; subagents run in Cowork.
- A connector says no access: reconnect it under Customize > Connectors.
- Otherwise, tell the plugin owners which plugin, which skill, and what
  you typed.
