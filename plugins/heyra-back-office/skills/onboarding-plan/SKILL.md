---
name: onboarding-plan
description:
  Build the onboarding plan for a new Heyra employee - access list, first
  week schedule, the mandatory trainings (responsible gaming, anti-money
  laundering, data protection, IT security) with deadlines, buddy, 30/60/90
  day goals and the check-in dates - as a document and a task list. Use
  when the user asks for an onboarding plan, a first-week programme, or
  "what does a new hire need". For the vacancy text see job-description,
  and for handbook rules see policy-lookup.
argument-hint: "<name or role> <team> <start date> [--manager <name>] [--buddy <name>]"
---

# Onboarding plan

Input: `$ARGUMENTS`

## Steps

1. Collect: name (or role if not hired yet), team, manager, start date,
   buddy, work location, and whether the role has product, player-data or
   payment access. Ask one question at most.
2. Fill the template in [`templates/onboarding.md`](templates/onboarding.md).
3. Mandatory trainings for everyone (fictional Heyra rules), with deadlines
   from the start date:

   | Training                          | Deadline      | Owner            |
   | --------------------------------- | ------------- | ---------------- |
   | Responsible gaming basics         | Week 1        | Ansvarligt Spil  |
   | Data protection (GDPR)            | Week 2        | Jura & GDPR      |
   | IT security and phishing          | Week 1        | IT & Digital     |
   | Anti-money laundering (AML)       | Week 4        | Compliance       |
   | Code of conduct incl. gifts and the no-play rule | Week 1 | HR       |

   Roles with player-data access add "Handling player cases" (week 2).
   Roles with payment access add "Payout controls" (week 3).
4. Access list from the role: Microsoft 365, ~~tickets, ~~wiki, the CRM for
   partner roles, the customer system for customer-centre roles, the
   finance system for finance roles. Each with an owner and "day 1" or
   "week 1".
5. 30/60/90 goals: three per period, observable, agreed with the manager.
6. Deliver the plan. Offer to create the tasks in ~~tickets (one ticket per
   access and training, assigned to the owner, due dates set) and to save
   the plan in ~~files under `HR/Onboarding/<name>/`. Confirm before
   creating anything.

## Rules

- No salary, health or private details in the plan. It lives in the HR
  system.
- Buddy is never the manager.
- First-week schedule has at least one lunch with the team and one hour of
  no meetings per day.
