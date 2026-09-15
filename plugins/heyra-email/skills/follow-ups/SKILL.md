---
name: follow-ups
description:
  List the open loops in the user's mail - asks they sent that got no
  answer, promises they made that are due, and mails they were asked to
  answer - with a suggested nudge for each, drafted in the house style. Use
  when the user asks what they are waiting on, what they owe, or wants
  reminders drafted. For the house rules see email-style, for a full inbox
  pass see inbox-triage, and to write the nudge see draft-reply.
argument-hint: "[--days 7] [--only waiting|owed]"
---

# Follow-ups

Options: `$ARGUMENTS` (default: last 7 days).

## Steps

1. Load `email-style` if it is not in context.
2. With ~~email connected, read sent mail for the period and find messages
   that ask a question or request something and have no reply in the
   thread. Then read the inbox for mails that ask the user for something and
   have no reply from the user. Also scan the user's sent mail for promises
   ("jeg vender tilbage", "I will send", "senest fredag") that are due.
   Without a connector, ask the user to paste the relevant threads or
   describe them.
3. Build two lists: **Waiting on others** and **Owed by me**. Each item:
   who, what, since when, due date if any.
4. For every item older than 3 working days, draft a nudge: two sentences,
   polite, with a concrete ask and a date. Use the nudge example in
   email-style's references.
5. Deliver the tables and the nudges. Offer to save the nudges as Outlook
   drafts. Never send.

```markdown
# Open loops, last <n> days

## Waiting on others
| Who | What I asked | Since | Nudge? |
|-----|--------------|-------|--------|

## Owed by me
| Who | What I promised | Due | Status |
|-----|-----------------|-----|--------|

## Nudges (drafts)
### To <name>: <subject>
<two sentences>
```

## Rules

- Do not nudge an authority or a journalist without the user's explicit ok.
- Do not nudge anyone twice in the same week.
- A promise with a passed due date goes to the top, marked **overdue**.
