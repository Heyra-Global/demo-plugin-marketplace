# heyra-back-office

Finance, HR and legal admin for Heyra in one plugin. Heyra is a fictional
Danish betting and gaming operator invented for this demo; every policy,
limit and threshold is made up.

## What is in it

| Component                   | Where                              | Area    | What it does                                                                    |
| --------------------------- | ---------------------------------- | ------- | ------------------------------------------------------------------------------- |
| Skill: `invoice-check`      | `skills/invoice-check/`            | Finance | Fields, VAT, arithmetic, PO match, duplicates, approval route, verdict           |
| Skill: `expense-policy`     | `skills/expense-policy/`           | Finance | Loads on its own: limits, gifts and hospitality, the no-play rule               |
| Skill: `job-description`    | `skills/job-description/`          | HR      | Vacancy text with the mandatory Heyra paragraphs, DA and EN template            |
| Skill: `onboarding-plan`    | `skills/onboarding-plan/`          | HR      | Access list, first week, mandatory trainings, 30/60/90 goals, tickets on request |
| Skill: `policy-lookup`      | `skills/policy-lookup/`            | HR      | Answers from the employee handbook (`references/handbook.md`), rule quoted      |
| Skill: `contract-summary`   | `skills/contract-summary/`         | Legal   | Summary against Heyra's standard positions, red flags, questions for Jura        |
| Skill: `gdpr-request`       | `skills/gdpr-request/`             | Legal   | Classify, verify, log, deadline, systems, retention exceptions, draft reply     |
| Connectors                  | `CONNECTORS.md`, `.mcp.json`       |         | Microsoft 365 built in; Atlassian (Jira, Confluence) as remote MCP; HR and finance systems as custom connectors |

All skills work in Claude Chat, Cowork and Claude Code, with or without
connectors.

## Try it

```text
Tjek denne faktura fra trykkeriet mod indkøbsordre 4471.
Må jeg give en forhandler en julegave til 1.500 kr.?
Skriv et jobopslag: Key Account Manager, Retail, Roskilde, hybrid.
Lav en onboardingplan for en ny medarbejder i kundecentret med start 1. oktober.
Hvor mange feriefridage har jeg?
Opsummer denne leverandørkontrakt, og sig, hvad Jura skal se på.
En spiller skriver "slet alle mine data". Hvad gør jeg?
```

The GDPR skill shows something specific to a licensed operator: an erasure
request gets a partial answer, because anti-money-laundering and
self-exclusion records must be kept. The skill knows that and drafts the
reply accordingly.

## Why one plugin for three departments

Small teams share one admin surface. One install, one place to look. If a
department grows its own workflows, split it out; the marketplace makes
that a rename, not a rewrite.
