---
name: campaign-brief
description:
  Create a one-page marketing campaign brief for Nordlys Analytics - goal,
  audience, core message, channels, timeline and KPIs - and save it under
  marketing/campaigns/. Use when the user asks for a campaign brief, a launch
  plan or a go-to-market one-pager. For the voice rules see brand-guidelines,
  for a single post see linkedin-post, and to audit the result see brand-check.
argument-hint: "<campaign name> [audience]"
arguments: [campaign, audience]
disable-model-invocation: true
---

# Campaign brief

Campaign: **$campaign**
Audience: **$audience** (default when empty: data leads at mid-size
manufacturers)

This skill shows **named arguments**: the `arguments` frontmatter field maps
the first word to `$campaign` and the rest to `$audience`. Compare with
`linkedin-post`, which uses the raw `$ARGUMENTS` string.

## Steps

1. Load the `nordlys-brand:brand-guidelines` skill if it is not in context.
2. If the goal or the primary KPI is unknown, ask **one** question with
   `AskUserQuestion` that covers both. Do not ask more than two questions in
   total.
3. Fill the template at
   [`templates/campaign-brief.md`](templates/campaign-brief.md). Every section
   is mandatory. Keep the whole brief under 400 words.
4. Save it to `marketing/campaigns/<slug>.md` in the current project, where
   `<slug>` is the campaign name in lowercase kebab-case. Create the folder if
   it does not exist. Never overwrite an existing brief; append `-v2`.
5. Reply with the file path and the core message in one line. Suggest
   `/nordlys-brand:brand-check marketing/campaigns/<slug>.md` as the next step.

## Rules

- The core message must be one sentence a salesperson can say out loud.
- KPIs are numbers with a date. "More leads" is not a KPI. "12 qualified
  meetings by 30 November" is.
- Channels come from this list only: LinkedIn (company), LinkedIn (founder),
  newsletter, webinar, partner co-marketing, event. No paid social in this
  demo brand.
