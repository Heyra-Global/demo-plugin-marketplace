---
name: pipeline-review
description:
  Run the weekly partner pipeline review - every open deal with stage, next
  step and date, stale deals flagged, an honest forecast for the quarter,
  and the three actions that move the most value. Use when the user asks
  for a pipeline review, a forecast, deal status, or what to focus on this
  week. For stage definitions and hygiene rules see partner-playbook, for a
  single deal's background see account-research, and to write the mails see
  follow-up-email.
argument-hint: "[--owner me|<name>] [--quarter Q4] [--stale 14]"
---

# Pipeline review

Options: `$ARGUMENTS` (default: my deals, current quarter, stale after 14 days).

## Steps

1. Load `partner-playbook` if it is not in context. The stage exit criteria
   and hygiene rules define "stale" and "healthy".
2. Read the open deals from ~~CRM: name, type, stage, amount, close date,
   next step, next step date, last activity. Without a connector, ask for an
   export or a pasted list.
3. Flag:
   - **stale**: no activity for more than the stale threshold, or no next
     step;
   - **unrealistic**: close date in the past, or a Tilbud stage with no
     offer sent;
   - **compliance**: any deal note that mentions bonuses, free plays,
     exclusivity or cash gifts.
4. Forecast: sum only deals in Forhandling or later with a next step and a
   close date inside the quarter. Show the rest separately as "possible".
   Do not weight by gut feeling.
5. Pick the three actions that move the most value this week.

```markdown
# Pipeline review, <owner>, week <n>

Forecast <quarter>: DKK <n> committed (n deals) | DKK <n> possible (n deals)

## Deals
| Deal | Type | Stage | Amount | Close | Next step | Flag |
|------|------|-------|--------|-------|-----------|------|

## Stale (<n>)
- <deal>: <days> days without activity. Suggested: <action>

## Compliance flags
- <deal>: <what was found>. Fix before the next step.

## Focus this week
1. <action> (<deal>, <value>)
2. ...
3. ...
```

6. Offer to update next steps and dates in ~~CRM for the deals the user
   confirms.

## Rules

- Never move a stage without the exit criterion being met.
- A stale deal is reported, not closed. Closing is the owner's call.
- No player data, no personal notes about contacts in the review.
