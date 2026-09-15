---
name: inbox-triage
description:
  Sort an employee's Outlook inbox into act today, this week, for
  information, redirect and noise, with a one-line reason and a suggested
  action per mail, and flag the mails that must be redirected the same day
  (self-exclusion requests, press, players). Use when the user asks to
  triage, sort, prioritise or "go through" their inbox or a batch of emails.
  For the house rules see email-style, to answer a mail see draft-reply, and
  for open loops see follow-ups.
argument-hint: "[--since today|3d|week] [--folder Inbox] [--vip <names>]"
---

# Inbox triage

Options: `$ARGUMENTS`

## Steps

1. Load `email-style` if it is not in context. The redirect table there is
   binding.
2. Get the mails. With ~~email connected, read the inbox for the requested
   period (default: since yesterday 17:00, unread and flagged first). Without
   a connector, ask the user to paste the list (sender, subject, first
   lines). Never ask for more than that.
3. Classify each mail with the rules in
   [`references/categories.md`](references/categories.md). One category per
   mail. When two apply, the more urgent wins.
4. Output the table below, sorted P1, P2, Redirect, P3, Noise. Keep reasons
   under 12 words. Suggested actions are verbs: reply, forward, decide,
   read, archive.
5. After the table: the three mails that need the user's attention first,
   in one sentence each, and the redirects that are time-critical.
6. Do nothing to the mailbox. If the user asks you to move, flag or archive,
   confirm the exact list first, then act through ~~email.

```markdown
# Inbox triage, <period>: <n> mails

| Prio | From | Subject | Why | Suggested action |
|------|------|---------|-----|------------------|
| P1 today | ... | ... | deadline in subject | reply, decide by 15:00 |
| Redirect | ... | ... | player mail | forward to Kundecenter, one-line reply |

## Do first
1. ...
2. ...
3. ...

## Redirect now
- <mail>: forward to <address> (self-exclusion requests: today, no marketing content)

Want me to draft the P1 replies? Say which.
```

## Rules

- Mails from the user's manager and from anyone on the `--vip` list are
  never below P2.
- Anything mentioning ROFUS, udelukkelse, pause, spilstop, "luk min konto"
  is Redirect with the same-day flag, regardless of sender.
- Anything from a journalist or a media domain is Redirect to Presse.
- Newsletters and automated notifications are Noise unless they report a
  failure, a security event or an invoice.
- Do not summarise mail bodies in the table. Privacy first: subject and
  sender are enough to triage.
