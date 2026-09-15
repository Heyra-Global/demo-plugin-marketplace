---
name: weekly-status
description:
  Write the weekly status report for a team or a project from the week's
  minutes, actions, mail and chat - done, in progress, blocked, decisions
  needed, next week - in the Heyra format with honest red, amber and green
  markers. Use when the user asks for a status report, a weekly update, or
  "what happened this week". For the inputs see action-tracker and
  meeting-minutes, and for the document standard see minutes-format.
argument-hint: "[--team <name>] [--week <n>] [--for manager|steering|team]"
---

# Weekly status

Options: `$ARGUMENTS` (default: the current week, for the team's manager).

## Steps

1. Load `minutes-format` if it is not in context.
2. Gather the week: minutes and action tables from ~~files, decisions in
   ~~chat, and the user's own notes. Without connectors, ask for the notes.
3. Sort every item into: done, in progress, blocked, decision needed, next
   week. Blocked means someone outside the team must act.
4. Set the overall marker: green (on plan), amber (a risk with a named
   owner), red (a milestone will slip). Amber and red must point at a row in
   the report. Never "green" with a blocked item on the list.
5. Write for the reader. Manager: one screen, decisions needed on top.
   Steering group: add dates and money. Team: add the full action list.

```markdown
# Status uge <n>: <team or project>
Overall: <green | amber | red> because <one sentence>

## Decisions needed from you
1. <decision, by when, what happens if not>

## Done this week
- <item> (<owner>)

## In progress
- <item>, <expected date> (<owner>)

## Blocked
- <item>: waiting on <who> for <what> since <date>

## Next week
- <item> (<owner>)

## Numbers (optional)
| Metric | This week | Last week | Target |
|--------|-----------|-----------|--------|
```

6. Under 300 words for a manager. Offer to save to ~~files next to the
   minutes and to post the summary line in ~~chat.

## Rules

- Facts with sources. "Marketing says" is not a source; "A3 in Monday's
  minutes" is.
- No player data, no personnel details.
- Do not soften a red. The reader needs to act.
