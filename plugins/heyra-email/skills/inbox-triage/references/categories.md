# Triage categories for a Heyra employee inbox

| Category   | Meaning                          | Signals                                                                                                   | Default action                              |
| ---------- | -------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| P1 today   | Act before end of day            | `[Handling]` with a date today or tomorrow; "haster", "i dag", "frist"; from manager or VIP; an authority; an incident (terminal outage escalation, payment failure, security) | Reply or decide today |
| P2 week    | Act this week                    | Requests for input, reviews, approvals without a same-day deadline; meeting prep asks; partner questions   | Schedule a slot, reply with an ETA         |
| Redirect   | Not yours to answer              | Player about account, payout, game; self-exclusion or pause request; journalist; retailer operations; invoice; job applicant; fraud or threat | Forward per email-style table; one-line acknowledgement where the table says so |
| P3 info    | Read, no action                  | `[Til info]`, cc threads, reports, minutes, announcements                                                  | Read when convenient, archive              |
| Noise      | Skip                             | Newsletters, marketing, automated notifications without failures, out-of-office replies                    | Archive or unsubscribe                      |

## Sender heuristics

| Sender domain / type                     | Likely category                     |
| ---------------------------------------- | ----------------------------------- |
| `@heyra.example` (internal)              | P1 or P2 by content                 |
| Known retail chain or kiosk domain       | Redirect (operational) or P2 (commercial) |
| Media domains (dr.dk, tv2.dk, jp.dk, berlingske.dk, borsen.dk, finans.dk) | Redirect to Presse |
| Public authority (`.dk` ministries, spillemyndigheden.dk, datatilsynet.dk) | P1 |
| Webmail domains writing about "min konto", "udbetaling", "gevinst"          | Redirect to Kundecenter |
| Agencies and suppliers                   | P2                                   |
| no-reply, notifications, newsletters     | Noise, unless a failure or invoice   |

## Deadline words (Danish and English)

haster, i dag, senest, frist, deadline, inden kl., ASAP, today, by EOD,
urgent, reminder, påmindelse, 2. rykker.

## Same-day redirects (never wait)

- Self-exclusion, pause, limit, "luk min konto", ROFUS -> Ansvarligt Spil.
- Fraud, money laundering, threats -> Compliance, and call.
- Journalist with a deadline today -> Presse, and call.
