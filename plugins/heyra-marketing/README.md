# heyra-marketing

Marketing and communications plugin for **Heyra**, a fictional Danish
betting and gaming operator invented for this demo. It shows what a
marketing team gets from a plugin in Claude Chat and Claude Cowork: the brand
voice always at hand, the recurring documents as one-line commands, and a
compliance pre-check that knows the Danish gambling-marketing rules.

## What is in it

| Component                    | Where                                          | Works in                     | What it does                                                                 |
| ---------------------------- | ---------------------------------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| Skill: `brand-voice`         | `skills/brand-voice/`                          | Chat, Cowork, Claude Code    | Brand guide Claude loads on its own. Products, tone, mandatory block, palette, logo. `references/examples.md` with Danish before/after |
| Skill: `campaign-brief`      | `skills/campaign-brief/`                       | Chat, Cowork, Claude Code    | One-page brief from a template, with a compliance section                    |
| Skill: `social-post`         | `skills/social-post/`                          | Chat, Cowork, Claude Code    | Facebook, Instagram, LinkedIn or Teams post with three alternative openings   |
| Skill: `compliance-check`    | `skills/compliance-check/`                     | Chat, Cowork, Claude Code    | Pass/fail table against the Danish rules (`references/checklist.md`), pending rules separate |
| Skill: `press-release`       | `skills/press-release/`                        | Chat, Cowork, Claude Code    | Release, reactive statement or media Q&A in the press register               |
| Subagent                     | `agents/brand-compliance-reviewer.md`          | Cowork, Claude Code          | Read-only reviewer that preloads brand-voice and compliance-check             |
| Connectors                   | `CONNECTORS.md`                                | Chat, Cowork                 | Microsoft 365 for email and files, Teams, Canva. All skills work without them |
| Eval suite                   | `evals/`                                       | Claude Code                  | One case: a Facebook post must carry the mandatory block                     |

## Try it

In Claude Chat or Cowork, after the plugin is installed:

```text
Skriv et Facebook-opslag om lørdagens Ugens Tal-trækning. Puljen er 30 mio. kr.
Hvad er Heyras farver, og må jeg bruge gul tekst på den lyse baggrund?
Lav en kampagnebrief for påskeudgaven af Skrabelykke, målgruppe 25-45 år.
Tjek denne annonce: "Vind 30 millioner i aften! Sidste chance! Spil nu!"
Skriv en pressemeddelelse om, at 71 % af nye spillere sætter en indbetalingsgrænse.
```

In Cowork the skills also appear as slash commands:
`/heyra-marketing:social-post`, `/heyra-marketing:compliance-check`, and so on.

## Why the compliance check matters

Danish gambling ads must carry an age mark, a helpline reference and a
self-exclusion reference, must present gambling as entertainment, and must
respect strict bonus limits. The checklist encodes those rules with sources
and marks the 2025 political agreement's rules as pending. A marketer gets a
table, not a lecture. Final sign-off stays with the legal team.

## Fiction notice

Heyra, its products, numbers, people and palette are invented. The
regulatory references are real Danish rules summarised for a demo and are
not legal advice.
