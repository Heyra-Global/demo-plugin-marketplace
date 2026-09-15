---
name: account-research
description:
  Build a one-page profile of a prospective or existing partner - a retail
  chain, a sports club, an association or an employer - from CRM history,
  past mail, public sources and the partner playbook, with fit, contacts,
  risks and an opening angle. Use when the user asks to research, profile,
  or prepare for a first meeting with a partner. For the rules see
  partner-playbook, for the proposal see partner-offer, and for the mail
  afterwards see follow-up-email.
argument-hint: "<company or club name> [--type retail|sponsorship|b2b]"
---

# Account research

Input: `$ARGUMENTS`

## Steps

1. Load `partner-playbook` if it is not in context.
2. Look inside first: ~~CRM (company, contacts, past deals, notes), ~~email
   (threads with the domain), ~~files (old offers). Without connectors, ask
   the user what Heyra already knows.
3. Look outside: ~~web for the company's own site, size, locations, recent
   news, and, for clubs, league level and current sponsors. Business
   information only; do not collect personal details beyond name and role.
4. Assess fit with the playbook: partner type, likely tier or package, the
   compliance constraints that apply (youth members, alcohol venues,
   existing gambling sponsor).
5. Write the one-pager. Mark every inferred statement as such.

```markdown
# <Partner>, <type>

**Fit:** <strong | possible | weak> because <one sentence>
**Suggested tier or package:** <tier> (<why>)

## Facts
| Item | Value | Source |
|------|-------|-------|
| Outlets / members | ... | ... |
| Turnover / league | ... | ... |
| Current gambling partner | ... | ... |

## History with Heyra
- <deal, date, outcome> (~~CRM)

## People
| Name | Role | Relationship | Note |
|------|------|--------------|------|

## Risks and constraints
- <youth share, exclusivity, reputation, compliance>

## Opening angle
<Two sentences: the partner's problem and what Heyra offers for it.>

## Next step
<one action, owner, date>
```

6. Offer to save the profile as a note on the company in ~~CRM.

## Rules

- Never estimate turnover or membership without a source. Write "unknown".
- Do not research individuals' private lives or social media.
- If the prospect is a competitor's exclusive partner, say so and stop; do
  not draft an approach.
