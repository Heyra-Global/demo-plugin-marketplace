---
name: invoice-check
description:
  Check a supplier or retailer invoice before approval - mandatory fields,
  VAT, arithmetic, match against the purchase order or contract, duplicate
  signals, and the approval route by amount - and return a verdict with the
  exact fixes to request. Use when the user asks to check, verify, approve
  or "look at" an invoice or a credit note. For the spending rules see
  expense-policy, and for contract terms see contract-summary.
argument-hint: "<invoice text, PDF or file> [--po <number>] [--contract <file>]"
---

# Invoice check

Input: `$ARGUMENTS`

## Steps

1. Read the invoice. Extract: supplier name and CVR, invoice number, invoice
   date, due date, currency, line items, net, VAT, gross, payment details,
   PO or contract reference.
2. Check the mandatory fields for a Danish invoice: supplier CVR, invoice
   number, date, buyer name (Heyra A/S), description of goods or services,
   net amount, VAT rate and amount (25 % standard; note if 0 % or reverse
   charge and whether a reason is given), gross amount.
3. Arithmetic: line totals, net sum, VAT on net, gross. Show the numbers.
4. Match: with `--po` or `--contract`, or by finding the PO in ~~finance or
   ~~files, compare quantities, unit prices and totals. Tolerance: 2 % or
   DKK 500, whichever is lower. Report every difference.
5. Duplicate signals: same supplier and amount within 60 days, invoice
   number already seen, "rykker" or "reminder" wording. Check ~~finance or
   ~~email when available; otherwise flag as "check in the finance system".
6. Approval route (fictional Heyra policy):

   | Gross amount (DKK)   | Approver                         |
   | -------------------- | -------------------------------- |
   | up to 25,000         | Team lead                        |
   | 25,001 to 250,000    | Department head                  |
   | 250,001 to 1,000,000 | CFO                              |
   | above 1,000,000      | CFO and CEO                      |

   Retailer commission settlements follow the retail contract, not this
   table; route them to Økonomi & Udbetaling.
7. Verdict.

```markdown
# Invoice check: <supplier>, no. <number>

Verdict: <APPROVE | RETURN TO SUPPLIER | HOLD (question)>
Route to: <approver> (gross DKK <amount>)

| Check | Result | Detail |
|-------|--------|--------|
| Mandatory fields | pass/fail | missing: ... |
| VAT | pass/fail | 25 % of 12,000 = 3,000; invoice says 2,900 |
| PO match | pass/fail | line 3 qty 12 vs PO 10 |
| Duplicate signals | none/possible | ... |

## Ask the supplier
- <exact request, one per line>

## Note for the approver
<two sentences>
```

## Rules

- Never approve; the skill recommends, a person approves.
- Never change amounts. Report them.
- Keep bank details out of chat channels; refer to "payment details on the
  invoice".
