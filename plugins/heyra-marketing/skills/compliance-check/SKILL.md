---
name: compliance-check
description:
  Pre-check marketing material for Heyra against Danish gambling-marketing
  rules - the 18+ mark, StopSpillet and ROFUS references, the regulator
  label, content rules (no targeting minors, gambling as entertainment not
  income), bonus and offer limits, direct-marketing consent and the pending
  advertising restrictions - and return a pass/fail table with fixes. Use
  when the user asks to check, review or approve an ad, post, email, SMS,
  banner, script or campaign brief. For the voice rules see brand-voice; the
  checklist itself lives in this skill's references.
argument-hint: "<text, file, or campaign brief> [--channel social|email|sms|web|print|radio|tv|outdoor]"
---

# Marketing compliance check

Input: `$ARGUMENTS`

This is a **pre-check**, not legal advice. Final sign-off stays with Jura &
Compliance. Say that in the output.

## Steps

1. Read the material. If it is a file path, read the file. If it is a
   campaign brief, check every asset and channel it lists.
2. Determine the channel and whether the material promotes a game (then the
   full checklist applies) or is corporate (then only the content rules and
   the avoid list apply).
3. Walk through every rule in
   [`references/checklist.md`](references/checklist.md). For each rule
   decide **pass**, **fail**, **unclear** or **n/a**, quote the evidence (at
   most 15 words) and write the fix.
4. Rules marked *pending* in the checklist are not yet in force. Report
   them in a separate section as "would fail when the rule takes effect".
5. Output:

```markdown
# Compliance pre-check: <material>

Channel: <channel> | Promotes a game: <yes/no> | Result: <PASS | FAIL (n issues) | UNCLEAR (n questions)>

| # | Rule                              | Status  | Evidence                       | Fix                                  |
|---|-----------------------------------|---------|--------------------------------|--------------------------------------|
| 1 | 18+ mark visible                  | fail    | no age mark in the text        | add the mandatory block              |
| 2 | StopSpillet reference             | ...     |                                |                                      |

## Pending rules (not yet in force)
- ...

## House rules (brand, not law)
| # | Rule | Status | Evidence | Fix |
|---|------|--------|----------|-----|

## Questions for the owner
- ...

Pre-check only. Final approval: Jura & Compliance.
```

6. Section F of the checklist holds Heyra's own house rules (no pressure
   wording, game before money, the avoid list). Report them under a
   separate heading "House rules" so the team sees what is law and what is
   brand.
7. If the result is FAIL, offer a corrected version of the text that keeps
   the user's facts. Load the `brand-voice` skill for the rewrite: the
   corrected version must pass the law **and** the house rules, or it is
   not a corrected version.

## Notes

- "Unclear" is a valid status. Do not guess whether a photo model is under
  25 or whether a list was ROFUS-scrubbed; ask.
- Bonus maths: check the value, the deposit requirement, the wagering
  multiple and the deadline one by one. Show the numbers.
- Answer in the user's language. Keep rule names as in the checklist so the
  team can find them again.
