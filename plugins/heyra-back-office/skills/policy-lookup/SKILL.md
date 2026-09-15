---
name: policy-lookup
description:
  Answer questions about Heyra's employee handbook - working hours, remote
  work, holidays and leave, sickness, IT and phone use, the rules for
  employees and Heyra's own games, conflicts of interest, whistleblowing -
  with the rule quoted and the next step named. Use when the user asks
  "may I", "how many days", "what is the rule for", or any HR or conduct
  question. For expenses and gifts see expense-policy, for new hires see
  onboarding-plan, and for a contract see contract-summary.
argument-hint: "<question>"
---

# Policy lookup

Question: `$ARGUMENTS`

## Steps

1. Find the rule in [`references/handbook.md`](references/handbook.md). If
   the question is about expenses or gifts, load `expense-policy` instead.
   If the handbook has a newer version in ~~wiki (page "Personalehåndbog"),
   prefer that and say which version you used.
2. Answer in three parts: the answer in one sentence; the rule quoted or
   paraphrased with its section; the next step (who to ask, what to submit,
   where).
3. If the handbook does not cover it, say so and point to HR & People.
   Do not guess.
4. Personal cases (illness, conflicts, complaints): give the rule and the
   contact, then stop. Do not advise on the individual situation.

```markdown
**Answer:** <one sentence>

**Rule (handbook §<n>):** <quote or close paraphrase>

**Next step:** <action, contact>
```

Answer in the user's language. The handbook is in English with Danish
terms in brackets so both work.
