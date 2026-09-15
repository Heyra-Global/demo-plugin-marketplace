---
name: campaign-brief
description:
  Write a one-page campaign brief for a Heyra draw, scratch launch, sports
  weekend or corporate campaign - goal, audience, message, channels,
  timeline, budget, KPIs and the compliance section. Use when the user asks
  for a campaign brief, a launch plan or a go-to-market one-pager. For the
  voice rules see brand-voice, for the individual posts see social-post, and
  run compliance-check before the brief is approved.
argument-hint: "<campaign name> [product] [audience]"
---

# Campaign brief

Input: `$ARGUMENTS` (campaign name, optionally the product and the audience).

## Steps

1. Load the `brand-voice` skill if it is not already in context.
2. Collect the facts you need. Ask at most **two** questions, and only for
   things you cannot infer: the goal and the primary KPI, and the campaign
   window. Prize pools, odds and prices come from the user or from the
   campaign sheet in ~~files (SharePoint, "Marketing/Kampagneplan"). Never
   invent them.
3. Fill the template in [`templates/campaign-brief.md`](templates/campaign-brief.md).
   Every section is mandatory, including **Compliance**.
4. Deliver the brief as a document. In Cowork, save it to
   `Marketing/Kampagner/<yyyy-mm>-<slug>.md` in the working folder (or
   ~~files when connected). In Chat, return it as a downloadable file.
5. End with one line: the core message, and the suggestion to run
   `compliance-check` on the brief before approval.

## Rules

- The core message is one sentence a colleague can say out loud.
- KPIs are numbers with a date. "More players" is not a KPI. "12,000 new
  Fast Spil subscriptions by 30 November" is.
- Channels come from this list: own app and web, kiosk screens, social
  (Facebook, Instagram), LinkedIn (corporate only), email and SMS to
  consenting players, radio and outdoor, sponsorship assets.
- Direct channels (email, SMS) require a ROFUS scrub and marketing consent.
  Write that into the timeline as a task with an owner.
- Any offer (bonus, free plays, boosted odds) triggers the bonus rules in
  compliance-check. Put the terms in the brief.
- Talent in ads: nobody under 25, no athletes or celebrities implying that
  gambling made them successful (pending rule; treat as in force).
- Answer in the user's language. Brief headings may stay in English if the
  team works in English.
