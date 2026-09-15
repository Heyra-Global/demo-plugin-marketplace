---
name: action-tracker
description:
  Collect open actions across a team's minutes, flag the overdue ones, show
  who owns what, and draft short reminders per owner for Teams or mail. Use
  when the user asks what is open, who owes what, what is overdue, or wants
  reminders sent. For the minutes layout see minutes-format, to write new
  minutes see meeting-minutes, and for the weekly summary see weekly-status.
argument-hint: "[--folder <minutes folder>] [--owner me|<name>] [--overdue]"
---

# Action tracker

Options: `$ARGUMENTS`

## Steps

1. Load `minutes-format` if it is not in context.
2. Collect actions. With ~~files connected, read every minutes file in the
   folder (default `Møder/<team>/<yyyy>`, newest first, last 90 days) and
   parse the **Actions** tables. Without a connector, ask the user to paste
   the minutes or the action lists.
3. Deduplicate: the same action across several minutes is one row; keep the
   latest status and the original due date.
4. Sort: overdue first, then by due date. Filter by owner if asked.
5. Deliver the table, then the reminders.

```markdown
# Open actions, <team>, as of <date>

| # | Action | Owner | Due | Status | Source |
|---|--------|-------|-----|--------|--------|
| A7 | ... | Sofie | 2026-09-12 | **overdue** | 2026-09-05 ugemøde |

Overdue: <n> | Due this week: <n> | Open: <n>

## Reminders (drafts)
### Teams message to Sofie
Hej Sofie, kort påmindelse: A7 (<action>) havde frist 12/9. Kan du give en status inden torsdag? Tak.
```

6. With ~~chat connected, offer to send each reminder as a direct message.
   Confirm the list first. Never send to someone's manager without being
   asked.

## Rules

- One reminder per person, listing all their overdue items.
- Reminders are two sentences. No blame words.
- Actions marked done or dropped are not shown unless `--all` is given.
