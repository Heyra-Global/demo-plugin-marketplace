---
name: job-description
description:
  Write a job description for Heyra from a short role brief - title,
  purpose, tasks, requirements, what Heyra offers, the responsible-gaming
  and background-check notes, application details - in Danish or English,
  inclusive language, in the Heyra employer voice. Use when the user asks
  for a job ad, a job description, a role profile or a vacancy text. For
  the new hire's first weeks see onboarding-plan, and for policy questions
  see policy-lookup.
argument-hint: "<role title and a few facts: team, level, location, key tasks> [--lang da|en]"
---

# Job description

Input: `$ARGUMENTS`

## Steps

1. Collect the facts: title, team, manager title, location (Roskilde head
   office, customer centre, or hybrid), employment type, start date, three
   to five key tasks, must-have requirements. Ask one question at most; use
   `<placeholder>` for anything still unknown.
2. Use the template in [`templates/job-description.md`](templates/job-description.md).
3. Employer voice: warm, concrete, honest. Say what the job is like on a
   normal Tuesday. No "rockstar", no "fast-paced", no ten adjectives.
4. Inclusive language: describe the work, not the person. Requirements are
   the few things that are truly required; nice-to-haves are listed
   separately. No age, gender or family-status cues.
5. Mandatory paragraphs for every Heyra job:
   - Responsible gaming is part of every role at Heyra; the text says so in
     one sentence.
   - Roles in finance, compliance, customer centre, IT and management
     require a background check and a clean criminal record; the text says
     so.
   - Employees may not play Heyra Odds or Heyra Kasino; mention it for
     roles with product access.
   - Salary: state the range if HR has set one, otherwise "løn efter
     kvalifikationer" and the collective agreement if one applies.
6. Deliver the text, then a checklist of what HR must confirm before
   posting (range, start date, contact person, closing date).

## Rules

- Under 450 words.
- Danish for Danish postings; English only for international roles.
- Do not invent benefits. Use the list in the template and cut what does
  not apply.
