---
name: gdpr-request
description:
  Handle a data-subject request under GDPR at Heyra - classify it (access,
  erasure, rectification, objection, portability), verify identity, log it,
  set the one-month deadline, list the systems to search, apply the
  retention exceptions that a licensed gambling operator must respect
  (anti-money-laundering records, self-exclusion data), and draft the reply.
  Use when the user asks what to do with a request about someone's personal
  data, an "indsigtsanmodning" or "slet mine data". For contracts see
  contract-summary, for handbook rules see policy-lookup.
argument-hint: "<the request text or a description> [--type access|erasure|rectification|objection|portability]"
---

# GDPR data-subject request

Input: `$ARGUMENTS`

This is a procedure aid for the case handler. Jura & GDPR owns the process
and signs the reply. Say that in the output.

## Steps

1. Classify the request with the table in
   [`references/gdpr-procedure.md`](references/gdpr-procedure.md). A mail
   can contain more than one type.
2. Identity: check whether the requester is verified (MitID login in the
   player account, or a signed form). If not, the first reply is a
   verification request; the one-month clock still starts at receipt.
3. Log: case number in ~~tickets (project GDPR), received date, deadline
   (receipt plus one month; extendable by two months for complex cases,
   with a reason sent before the first month ends).
4. Systems to search, by type of person (player, retailer contact, employee,
   applicant), from the procedure reference.
5. Exceptions: AML records are kept 5 years after the customer relationship
   ends and cannot be erased on request; self-exclusion (ROFUS-related)
   data is kept as the regulator requires; accounting records 5 years;
   ongoing disputes. Erasure requests get a partial answer that names the
   legal basis for what is kept.
6. Draft the reply from the templates in the reference, in the requester's
   language. Never include another person's data.
7. Deliver the case sheet and the draft reply. Offer to create the ticket
   and to save the sheet in ~~files under `Jura/GDPR/<case>/`.

```markdown
# GDPR case <number>

Type: <access | erasure | ...> | Person: <player / retailer contact / employee / applicant> | Received: <date> | Deadline: <date>
Identity verified: <yes / no, verification requested on <date>>

## Systems to search
| System | Owner | Status |
|--------|-------|--------|

## Exceptions that apply
- <record type>: kept until <date>, basis: <law>

## Draft reply
<text>

Procedure aid. Sign-off: Jura & GDPR.
```

## Rules

- The deadline is calendar-based, not working days.
- Never confirm or deny that a person is a player to anyone but that
  verified person.
- Never delete anything yourself. The skill prepares; system owners act.
