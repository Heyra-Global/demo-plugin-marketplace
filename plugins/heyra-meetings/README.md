# heyra-meetings

Meeting support for Heyra teams: prepare, take minutes, chase actions,
report status. Heyra is a fictional Danish betting and gaming operator
invented for this demo.

## What is in it

| Component                 | Where                            | What it does                                                                        |
| ------------------------- | -------------------------------- | ----------------------------------------------------------------------------------- |
| Skill: `minutes-format`   | `skills/minutes-format/`         | The house standard Claude loads on its own: layout, numbering, classification, storage |
| Skill: `meeting-prep`     | `skills/meeting-prep/`           | One-page brief from the invite, last minutes, mail and chat                          |
| Skill: `meeting-minutes`  | `skills/meeting-minutes/`        | Minutes from notes, a Teams recap or a transcript. Saves and posts on request        |
| Skill: `action-tracker`   | `skills/action-tracker/`         | Open and overdue actions across minutes, with drafted reminders                      |
| Skill: `weekly-status`    | `skills/weekly-status/`          | Weekly report with honest red, amber, green                                         |
| Connectors                | `CONNECTORS.md`, `.mcp.json`     | Microsoft 365 (calendar, mail, Teams, files) built in; Fireflies as an optional remote MCP server |

All skills work in Claude Chat, Cowork and Claude Code, with connectors or
with pasted text.

## Try it

```text
Forbered mig på ugemødet på torsdag.
Her er mine noter fra styregruppemødet. Skriv et referat.
Hvilke actions er overskredet i marketingteamet?
Skriv ugens statusrapport til min chef.
```

## Why `.mcp.json` is here

This plugin shows how a plugin declares a **remote** MCP server: Fireflies
for transcripts. Cowork and Chat reach connectors through Anthropic's
cloud, so a plugin can only reference servers on the public internet. Local
servers and scripts are for Claude Code.
