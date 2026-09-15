# heyra-email

Email handling for Heyra employees in their own Outlook inbox. Heyra is a
fictional Danish betting and gaming operator invented for this demo.

## What is in it

| Component               | Where                             | What it does                                                                                     |
| ----------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------ |
| Skill: `email-style`    | `skills/email-style/`             | House rules Claude loads on its own: greetings, subject tags, response times, GDPR, redirect table |
| Skill: `inbox-triage`   | `skills/inbox-triage/`            | Sorts the inbox into act today, this week, redirect, info, noise. Flags same-day redirects        |
| Skill: `draft-reply`    | `skills/draft-reply/`             | Reply in the user's voice, answer first, saved as an Outlook draft. Never sends                   |
| Skill: `thread-summary` | `skills/thread-summary/`          | Decision, open questions, promises, tone, under 150 words                                        |
| Skill: `follow-ups`     | `skills/follow-ups/`              | Waiting-on and owed-by-me lists with drafted nudges                                              |
| Connectors              | `CONNECTORS.md`                   | Microsoft 365 mail and calendar. Every skill also works with pasted text                          |

All skills work in Claude Chat, Claude Cowork and Claude Code. No subagents,
no hooks: the plugin behaves the same everywhere.

## Try it

```text
Gå min indbakke igennem siden i går.
Svar Karin, at vi kan levere plakaterne fredag, kort og venligt.
Hvad handler tråden "Q4 media plan" om? Skriv til min chef.
Hvad venter jeg på svar på fra de sidste syv dage?
Her er en mail fra en spiller, der vil lukke sin konto. Hvad gør jeg?
```

The last one shows the plugin's most important rule: a self-exclusion
request is forwarded to the responsible-gaming team the same day, and the
reply contains no marketing.

## What it will not do

Send mail, move or delete mail without confirmation, or put player data
into a draft.
