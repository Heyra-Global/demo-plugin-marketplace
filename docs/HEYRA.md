# Heyra, the fictional company

Every plugin in this repository is written for one invented company, so the
examples hang together. This page is the shared world. Contributors keep
new content consistent with it; presenters use it to answer "who is Heyra"
in one breath.

**Nothing here is real.** The company, its products, numbers, people,
addresses and policies are invented for the demo. Real names of existing
operators, their products and slogans do not appear anywhere in this
repository, on purpose.

## Profile

| Item            | Value                                                                 |
| --------------- | --------------------------------------------------------------------- |
| Name            | Heyra A/S                                                             |
| What            | Licensed betting and gaming operator in Denmark                        |
| Supervised by   | The Danish Gambling Authority (Spillemyndigheden)                      |
| Head office     | Roskilde                                                               |
| Employees       | About 320, plus a customer centre open 10:00 to 20:00 every day        |
| Retail partners | About 2,800 kiosks, petrol stations and supermarkets with terminals   |
| Players         | About 1.1 million registered accounts                                 |
| Tagline         | *Spil med måde.* (EN: *Play for the fun of it.*)                        |

## Products

| Product      | What                                         | Rhythm             |
| ------------ | -------------------------------------------- | ------------------ |
| Ugens Tal    | Saturday number draw with a prize pool       | Saturday 19:00     |
| Nordtal      | Wednesday draw with a Nordic pool            | Wednesday 20:00    |
| Skrabelykke  | Scratch cards, seasonal editions             | New edition monthly |
| Fast Spil    | Subscription so a player never misses a draw | Monthly billing    |
| Puljespil    | Syndicate play for groups and workplaces     | Per draw           |
| Heyra Odds   | Sports betting, pre-match and live           | Sports calendar    |
| Heyra Kasino | Slots, table games, live dealer              | Always on          |
| Heyra Bingo  | Online bingo rooms                           | Rooms every hour   |

## Departments (used as senders, owners and addresses)

| Department                       | Mail (fictional)                | Appears in                        |
| -------------------------------- | ------------------------------- | --------------------------------- |
| Marketing & Kommunikation        | presse@heyra.example            | heyra-marketing, heyra-email      |
| Kundecenter                      | kundecenter@heyra.example       | heyra-email (redirects)           |
| Ansvarligt Spil & Compliance     | ansvarligtspil@, compliance@    | all plugins                       |
| Retail & Partnerskaber           | forhandlerservice@heyra.example | heyra-sales, heyra-email          |
| Økonomi & Udbetaling             | faktura@heyra.example           | heyra-back-office                 |
| HR & People                      | hr@, job@heyra.example          | heyra-back-office                 |
| Jura & GDPR                      |                                 | heyra-back-office, heyra-marketing |
| IT & Digital                     | it@heyra.example                | heyra-back-office, heyra-dev      |
| Lotteri & Skrab, Sport & Kasino  |                                 | product facts                     |

## Brand in short

Colours: Nordhav `#10233F` (primary dark), Lys `#FBF7EF` (background),
Gevinst `#F2B233` (accent), Hav `#1B7F8E` (secondary), Sten `#6B7280`,
Varsel `#D9483B`. Type: Inter. Voice: warm, playful, plain Danish, honest
about odds, never pressure. Full guide in
`plugins/heyra-marketing/skills/brand-voice/SKILL.md`.

Mandatory block on player-facing material:

```
18+ | Spil med måde | Hjælp: StopSpillet 70 22 28 25 | Udeluk dig selv via ROFUS | Spillemyndigheden
```

## Scenario anchors (reuse these in demos)

- The Saturday Ugens Tal draw with a DKK 30 million pool.
- The Easter edition of Skrabelykke, price DKK 20, odds 1 to 3.8 per card.
- A Champions League weekend for Heyra Odds.
- A player's self-exclusion request that lands in a marketer's inbox.
- A retailer's terminal outage in store 4412.
- A DKK 1 million+ winner who needs Vinderservice.
- A GDPR erasure request from a player with AML records that must be kept.
- A supermarket chain "Nordkøb" and a handball club "Roskilde Håndbold" as
  prospective partners (both invented).

## What is real

The regulatory references in the marketing plugin's checklist: the Danish
Gambling Act's marketing section, the Gambling Authority's guides on the
duty of disclosure and on promotions (July 2025), ROFUS and StopSpillet,
and the October 2025 political agreement on advertising restrictions
(pending as of September 2026). They are summarised for a demo and carry
their sources; the compliance team owns the real list.

## Rules for contributors

- Keep the company name "Heyra" and the product names above.
- Do not add real operators, their products or slogans.
- Use `heyra.example` for addresses and invented phone numbers, except the
  real StopSpillet helpline, which is required in Danish gambling ads.
- Danish examples are welcome; keep instructions in English.
