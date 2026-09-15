---
name: partner-offer
description:
  Draft an offer or proposal for a retail partner, a sponsorship or a B2B
  agreement from the Heyra templates - scope, tier or package, commission
  or fee, obligations on both sides, compliance clauses, validity - in
  Danish or English. Use when the user asks for an offer, a proposal, a
  quote or a sponsorship package. For prices and rules see
  partner-playbook, for the background see account-research, and for the
  mail that carries the offer see follow-up-email.
argument-hint: "<partner> <retail|sponsorship|b2b> [--tier kiosk|supermarked|kæde] [--package bronze|sølv|guld] [--lang da|en]"
---

# Partner offer

Input: `$ARGUMENTS`

## Steps

1. Load `partner-playbook`. Prices, tiers and the may/may-not table are
   binding. Never invent a discount or an extra.
2. Get the partner facts from ~~CRM or the user: legal name, CVR number,
   address, contact, number of outlets or members, start date wanted.
   Ask at most one question.
3. Fill the template in [`templates/offer.md`](templates/offer.md).
   Keep the numbers from the playbook. If the user wants something outside
   the playbook, write it as "subject to approval by Head of Partnerships"
   and flag it in the notes.
4. Compliance clauses are mandatory in every offer: training before go-live,
   age-check signage, the responsible-gaming block on partner material, no
   player-facing bonuses, data limited to aggregate sales.
5. Validity: 30 days. Signature block for both parties.
6. Deliver the offer as a document (save to ~~files under
   `Partnere/<partner>/` on request) and a three-line summary for the cover
   mail. Suggest `follow-up-email` for the mail.

## Rules

- Amounts in DKK with thousands separators, VAT stated ("ekskl. moms").
- No exclusivity clauses. No cash or credit incentives.
- Danish for Danish partners. The English template is for international
  sponsors.
