---
name: meeting-prep
description:
  Prepare a one-page brief for an upcoming meeting - purpose, who attends
  and why, what happened since last time in mail and chat, open actions from
  the last minutes, a proposed agenda with timings, and the questions to
  ask. Use when the user asks to prepare for, get ready for, or brief them
  on a meeting. For the minutes afterwards see meeting-minutes, for the
  standard see minutes-format, and for open actions see action-tracker.
argument-hint: "<meeting title, time or 'next meeting'> [--depth quick|full]"
---

# Meeting prep

Input: `$ARGUMENTS` (default: the next meeting in the calendar; depth quick).

## Steps

1. Find the meeting. With ~~calendar connected, read the invite: title,
   time, attendees, agenda text, attachments. Without a connector, ask the
   user to paste the invite.
2. Gather context, in this order, stopping when the depth is reached:
   - **quick**: the invite plus the last minutes for this meeting series
     from ~~files (folder `Møder/<team>/<yyyy>`).
   - **full**: also the last two weeks of ~~email threads with the
     attendees and the relevant ~~chat channel.
3. Pull open actions from the last minutes (owner, due date, status).
4. Write the brief. Under one page. Facts only; mark anything inferred.

```markdown
# Prep: <meeting>, <date time>

**Purpose:** <one sentence, from the invite or inferred (marked)>
**Decision expected:** <what must be decided, or "none, information only">

## Who is there and why
| Name | Role | What they want from this meeting |
|------|------|----------------------------------|

## Since last time
- <fact with source: mail from X on date, minutes D3, chat>

## Open actions from last minutes
| # | Action | Owner | Due | Status |
|---|--------|-------|-----|--------|

## Proposed agenda (<n> min)
1. <item> (<min>, owner)
2. ...

## Questions to ask
- ...

## Watch out
- <risk, disagreement, sensitive topic>
```

## Rules

- No player data in the brief. Refer to case numbers.
- If the meeting touches personnel, legal or regulator matters, label the
  brief **Fortrolig** and do not post it to a channel.
- Offer to save the brief next to the minutes in ~~files or to paste it
  into the invite notes. Do not send it to attendees without being asked.
