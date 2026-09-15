---
name: minutes-format
description:
  The Heyra standard for meeting documents - the minutes layout with
  numbered decisions and actions, classification labels, where minutes are
  stored, naming of files, and the rules for what never goes into minutes.
  Use when writing or reading minutes, action lists or status reports. To
  prepare a meeting see meeting-prep, to write minutes see meeting-minutes,
  to chase actions see action-tracker, and for the weekly report see
  weekly-status.
---

# Heyra minutes standard

Heyra is a fictional Danish betting and gaming operator used in this demo.

Answer in the language the user writes in. Minutes are written in the
language the meeting was held in.

## Layout

```
# <Meeting name>, <yyyy-mm-dd>
Classification: <Intern | Fortrolig>
Present: <names>  Absent: <names>  Minutes: <name>

## Decisions
D1. <decision, one sentence, who decided>
D2. ...

## Actions
| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|
| A1 | ... | <one name> | <yyyy-mm-dd> | open |

## Notes
<at most five bullets of context that a reader who was absent needs>

## Open questions
- <question> (owner: <name>)

Next meeting: <date, time, place>
```

Rules:

- Decisions and actions are numbered so people can refer to "A3" in Teams.
- One owner per action. "Team" is not an owner.
- Every action has a date. "ASAP" is not a date.
- Status values: open, done, blocked, dropped.
- Notes are for context, not a transcript. Five bullets at most.

## Classification

| Label      | Use when                                                     | Storage                                      |
| ---------- | ------------------------------------------------------------ | -------------------------------------------- |
| Intern     | Default. Anyone at Heyra may read                             | ~~files, Teams channel folder `Møder/<team>/<yyyy>` |
| Fortrolig  | Personnel, legal, security, unreleased results, regulator dialogue | ~~files restricted folder; never in a Teams channel |

## What never goes into minutes

- Player names, account numbers, deposit or loss amounts, self-exclusion
  cases. Refer to a case number.
- Personal remarks about attendees.
- Verbatim quotes, unless the person asked to be quoted.

## File naming

`<yyyy-mm-dd> <meeting name> - referat.md`, for example
`2026-09-18 Marketing ugemøde - referat.md`.
