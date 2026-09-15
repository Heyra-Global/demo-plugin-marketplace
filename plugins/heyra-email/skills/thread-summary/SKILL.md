---
name: thread-summary
description:
  Summarise a long email thread in under 150 words - what was decided, what
  is still open, who owes what by when, and the tone of the conversation -
  for the user, their manager or the team. Use when the user asks what a
  thread is about, to catch up on a conversation, or to brief someone on it.
  For replying afterwards see draft-reply, for sorting see inbox-triage, and
  for the house rules see email-style.
argument-hint: "<thread subject or pasted thread> [--for me|manager|team] [--lang da|en]"
---

# Thread summary

Input: `$ARGUMENTS`

## Steps

1. Get the thread. With ~~email connected, open it by subject; otherwise use
   the pasted text. Read every message, oldest first.
2. Extract, in this order: the decision (if any), open questions, promises
   made (who, what, by when), and disagreements.
3. Note the tone in one word: routine, tense, urgent, stalled.
4. Write for the chosen reader. Manager: lead with the decision needed from
   them. Team: lead with the actions. Me: lead with what I owe.
5. Under 150 words. No quotes longer than ten words. No player data.

```markdown
# <Subject> (<n> mails, <first date> to <last date>)

**Status:** <decided | open | stalled> | **Tone:** <word>

**Decision:** <one sentence, or "none yet">

**Open:**
- <question> (waiting on <name>)

**Promises:**
| Who | What | By |
|-----|------|----|

**Suggested next step for you:** <one sentence>
```

If the thread contains a self-exclusion request, a press enquiry or a
player case, say so first and point to the redirect rule in email-style.
