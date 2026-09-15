---
name: contract-summary
description:
  Summarise a retailer, supplier, sponsorship or service contract for a
  non-lawyer - parties, term, notice, fees, liability caps, data protection,
  gambling-licence and marketing obligations, change and exit terms - and
  list the red flags against Heyra's standard positions. Use when the user
  asks what a contract says, whether it is safe to sign, or for a summary
  before a meeting with Jura. For the partner standards see the heyra-sales
  plugin's playbook, for GDPR requests see gdpr-request, and for policy
  questions see policy-lookup.
argument-hint: "<contract text or file> [--type retailer|supplier|sponsorship|service] [--lang da|en]"
---

# Contract summary

Input: `$ARGUMENTS`

This is a summary for preparation, not legal advice. Jura & GDPR signs off.
Say that in the output.

## Steps

1. Read the whole contract. Note the language and the governing law.
2. Extract into the table below. Quote clause numbers. Where a term is
   missing, write "not stated", which is itself a finding.
3. Compare with Heyra's standard positions (fictional):

   | Topic                 | Heyra standard                                              |
   | --------------------- | ----------------------------------------------------------- |
   | Term and notice       | 12 months, then 3 months' notice; immediate exit on licence change or breach of gambling rules |
   | Liability             | Capped at 12 months' fees; no cap for data breaches caused by the counterparty |
   | Data protection       | Data processing agreement (databehandleraftale) where personal data is processed; EU hosting; sub-processors listed |
   | Marketing             | Counterparty uses Heyra material unchanged, with the responsible-gaming block; no own gambling promotion |
   | Exclusivity           | Never granted by Heyra                                       |
   | Incentives            | No bonuses, free plays, cash or gift cards                  |
   | Payment               | 30 days net; commission monthly                             |
   | Audit                 | Heyra may audit compliance with age checks and AML on notice |
   | Governing law         | Danish law, Danish courts                                    |

4. Red flags: every deviation from the standard, anything that could
   conflict with the gambling licence (marketing to minors, incentives,
   data sharing), automatic renewal without notice, unlimited liability for
   Heyra, foreign law.
5. Deliver.

```markdown
# Contract summary: <title>

Type: <type> | Parties: <a> and <b> | Law: <country> | Prepared for: <meeting/date>

| Topic | What the contract says (clause) | Heyra standard | Status |
|-------|----------------------------------|----------------|--------|
| Term and notice | ... (§4) | 12 m + 3 m | ok / deviation |

## Red flags
1. <clause>: <why it matters> -> <ask for>

## Questions for Jura
- ...

Summary for preparation only. Sign-off: Jura & GDPR.
```

## Rules

- Never say a contract "is fine". Say which standards it meets and which
  it does not.
- Keep the counterparty's confidential figures out of chat channels.
