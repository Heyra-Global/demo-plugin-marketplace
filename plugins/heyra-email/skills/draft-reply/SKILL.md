---
name: draft-reply
description:
  Draft a reply to an email or a thread in the user's own voice and the
  Heyra house style - answer first, next step named, right greeting and
  sign-off, Danish or English as the thread - and put it in Outlook as a
  draft when the connector is available. Use when the user asks to reply,
  answer, respond to, or "write back" on a mail. For the rules see
  email-style, for sorting see inbox-triage, and for a long thread first see
  thread-summary.
argument-hint: "<email, thread or subject> [--tone short|formal|warm] [--lang da|en] [--say <the answer in a few words>]"
---

# Draft a reply

Input: `$ARGUMENTS`

## Steps

1. Load `email-style` if it is not in context.
2. Read the mail or thread. With ~~email connected, open it by subject or
   sender; otherwise use the pasted text. Identify: who asks, what exactly,
   by when, and what the user has already said in the thread.
3. If the mail is in the redirect table in email-style, do not draft an
   answer to the case. Draft the one-line acknowledgement and the internal
   forward instead, and say why.
4. Learn the user's voice. The first time in a session, read three recent
   sent mails through ~~email (or ask the user to paste two). Match their
   greeting, sign-off, sentence length and formality. Never invent a
   signature; use the one in their sent mail or a placeholder.
5. Decide the answer. If `--say` is given, that is the answer. If the answer
   needs a fact the user has not given (a date, a price, a yes or no), ask
   **one** question or leave a clearly marked `<placeholder>`.
6. Write the reply: answer in the first sentence, at most three short
   paragraphs, one named next step with an owner and a date. Tone per the
   flag; default matches the incoming mail.
7. Deliver the subject line and the body. With ~~email connected, offer to
   save it as a draft in Outlook. Never send.

```markdown
**Subject:** <subject>

<body>

---
Notes: <facts assumed, placeholders to fill, redirect reason if any>
Draft saved to Outlook: <yes/no>
```

## Rules

- No player data, no CPR numbers, no account details. Refer to the case
  number.
- Do not promise a date the user did not give.
- Do not apologise more than once. Do not thank more than once.
- Keep the thread's language. Danish threads get Danish replies.
