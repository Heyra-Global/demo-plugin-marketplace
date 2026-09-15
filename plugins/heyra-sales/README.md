# heyra-sales

Partner sales for Heyra: retail partners, sponsorships and B2B agreements.
Heyra is a fictional Danish betting and gaming operator invented for this
demo; all prices and tiers are made up.

## What is in it

| Component                  | Where                              | What it does                                                                     |
| -------------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| Skill: `partner-playbook`  | `skills/partner-playbook/`         | Loads on its own: partner types, tiers, packages, stages, what Heyra may not offer |
| Skill: `account-research`  | `skills/account-research/`         | One-page partner profile from CRM, mail and public sources                        |
| Skill: `partner-offer`     | `skills/partner-offer/`            | Offer from the template with mandatory compliance clauses (DA and EN)             |
| Skill: `follow-up-email`   | `skills/follow-up-email/`          | Recap mail plus CRM note after a meeting                                          |
| Skill: `pipeline-review`   | `skills/pipeline-review/`          | Weekly review, stale deals, honest forecast, three focus actions                   |
| Connectors                 | `CONNECTORS.md`, `.mcp.json`       | Microsoft 365 built in; HubSpot as the example CRM (remote MCP server). Swap for Dynamics 365 |

All skills work in Claude Chat, Cowork and Claude Code, with or without
connectors.

## Try it

```text
Undersøg Kvickly-lignende kæden "Nordkøb" som forhandlerpartner.
Lav et tilbud til Roskilde Håndbold på en Sølv-sponsorpakke.
Her er mine noter fra mødet med Nordkøb. Skriv opfølgningsmailen.
Kør ugens pipeline-gennemgang for mine deals.
```

## The point of the playbook

A gaming operator cannot sell like a software vendor: no bonuses through
partners, no exclusivity, no gifts beyond a policy limit, training before
go-live. The playbook skill puts those limits into every offer and every
pipeline review without anyone remembering to add them.
