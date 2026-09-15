---
name: follow-up-email
description:
  Write the mail after a partner meeting or call - a short recap, what Heyra
  will do, what the partner will do, dates, and the offer attached when
  there is one - in the Heyra partner voice, and log the same as a CRM note.
  Use when the user asks for a follow-up, a recap mail, a thank-you after a
  meeting, or to "send them what we agreed". For the tone and rules see
  partner-playbook, for the attachment see partner-offer, and for the deal
  status see pipeline-review.
argument-hint: "<partner> <notes from the meeting> [--lang da|en]"
---

# Follow-up email

Input: `$ARGUMENTS`

## Steps

1. Load `partner-playbook` if it is not in context.
2. From the notes (or ~~calendar and the user's summary), extract: what was
   agreed, what is still open, next steps with owners and dates, and any
   promise Heyra must not make (see the may/may-not table).
3. Write the mail: under 150 words, "du", warm and practical. Structure:
   thanks in one line; what we agreed as three bullets at most; next step
   with a date; one closing line. Attach or link the offer when one exists.
4. Write the CRM note: date, attendees, agreed points, objections, next
   step and date, stage change if any. Offer to save it to the deal in
   ~~CRM and to move the stage.
5. Deliver both. With ~~email connected, offer to save the mail as a draft.
   Never send.

```markdown
**Emne:** Opfølgning på vores møde <dato> - <partner> og Heyra

Hej <fornavn>

Tak for mødet i dag. Kort opsummering af det, vi aftalte:
- <punkt>
- <punkt>
- <punkt>

Næste skridt: <hvem gør hvad, senest dato>.

<Én venlig afsluttende linje.>

Venlig hilsen
<navn>
Partnerskaber, Heyra

---
CRM-note (<deal>): <text>
Stage: <from> -> <to>
```

## Rules

- Only confirm what was agreed. Open points are listed as open.
- No numbers outside the playbook without "subject to approval".
- No hospitality promises beyond the gifts policy.
