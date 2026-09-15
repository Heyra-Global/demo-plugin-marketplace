---
name: meeting-minutes
description:
  Turn notes, a Teams recap or a transcript into Heyra-standard minutes with
  numbered decisions, an action table with one owner and a date each, and
  open questions, then save them to the team folder and post the actions in
  chat on request. Use when the user asks for minutes, a summary of a
  meeting, or "what did we decide". For the layout see minutes-format, to
  prepare next time see meeting-prep, and to chase the actions see
  action-tracker.
argument-hint: "<notes, transcript, recap or meeting title> [--lang da|en] [--post]"
---

# Meeting minutes

Input: `$ARGUMENTS`

## Steps

1. Load `minutes-format` if it is not in context.
2. Get the source. Pasted notes or a recap work as they are. A transcript
   from ~~transcripts (Fireflies) is fetched by meeting title or date. A
   Teams recording: ask the user to paste the recap; the plugin does not
   read recordings.
3. Extract decisions: statements where someone agreed on a course of action.
   One sentence each, with who decided when it matters.
4. Extract actions: every "X will", "kan du", "we need to" with a person.
   If an owner or a date is missing, list it under **Needs owner/date**
   rather than guessing. Ask at most one question to fill the gaps.
5. Write the minutes with the layout from minutes-format, in the meeting's
   language. Notes: at most five bullets. No quotes.
6. Apply the confidentiality rules: no player data, label Fortrolig when the
   topics call for it.
7. Deliver the minutes. Then offer:
   - save to ~~files `Møder/<team>/<yyyy>/<yyyy-mm-dd> <meeting> - referat.md`
   - with `--post`, post the **Actions** table to the team's ~~chat channel
     as a short message: "Referat fra <meeting> er i mappen. Actions: A1 ...".
   Confirm before saving or posting.

## Rules

- Decisions are what was agreed, not what was discussed.
- Never assign an action to someone who was absent without marking it
  "to be confirmed".
- Keep the transcript out of the minutes and out of the folder unless the
  user asks to keep it.
