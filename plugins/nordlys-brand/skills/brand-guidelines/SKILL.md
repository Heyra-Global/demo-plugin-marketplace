---
name: brand-guidelines
description:
  Brand guidelines for Nordlys Analytics (a fictional demo company) - voice,
  writing principles, banned words, key messages, color palette with exact hex
  values, typography and logo rules. Use when writing or reviewing anything
  public for Nordlys - posts, web copy, slides, proposals, emails, dashboards -
  or when the user asks for the Nordlys colors, logo or tone of voice. For
  ready-made LinkedIn posts see linkedin-post, for campaign one-pagers see
  campaign-brief, and to audit a draft see brand-check.
---

# Nordlys Analytics brand guidelines

Nordlys Analytics is a fictional Nordic data and analytics consultancy used in
this demo. Everything below is invented. The structure is what matters: this is
how a real brand skill is laid out.

## Company in one paragraph

Nordlys ("northern lights" in Danish and Norwegian) helps mid-size companies in
manufacturing, energy and retail turn scattered operational data into decisions
they can defend. We build on Microsoft Fabric and dbt, we hand over working
systems, and we measure ourselves on time-to-first-decision.

**Tagline:** _Clear data. Confident decisions._

**Positioning:** For data leaders who need results in one quarter, not a
three-year platform program, Nordlys delivers a working analytics platform and
the first three decision-grade dashboards in twelve weeks.

## Tone of voice

| Do                                                   | Do not                                       |
| ---------------------------------------------------- | -------------------------------------------- |
| State the result, then the method                    | Open with the method or the technology       |
| Use one concrete number per claim                    | Use adjectives where a number would fit      |
| Write in first person plural ("we") and address "you" | Write about "the customer" in third person  |
| Short sentences, active voice                        | Nested clauses, passive voice                |
| Name the trade-off                                   | Promise "no downsides"                       |
| Plain words: use, build, fix, measure                | Hype words (see the banned list)             |

## Writing principles

1. **Answer first.** The first sentence carries the conclusion. A reader who
   stops there must still get the point.
2. **Evidence before adjectives.** "Reduced month-end close from 9 days to 4"
   beats "dramatically faster reporting".
3. **One idea per sentence.** About twenty words. No semicolons.
4. **No hedging stack.** Write "we recommend", not "we would suggest that it may
   be worth considering".
5. **Say what it costs.** Time, money or effort. Readers trust copy that names a
   price.

## Banned words

Never use these words in Nordlys copy. The list lives in
[`assets/banned-words.json`](../../assets/banned-words.json) and is enforced by
the plugin's banned-words hook on every file you write.

revolutionary, game-changing, cutting-edge, synergy, leverage, unlock,
seamless, next-level, disrupt, supercharge, empower, delve, world-class,
best-in-class, 10x, unleash, elevate, robust, holistic, paradigm,
state-of-the-art, "in today's fast-paced world".

Replacements: leverage -> use, unlock -> get, seamless -> without manual steps,
empower -> let, robust -> reliable, elevate -> improve.

## Key messages

- **Primary:** "A working analytics platform and your first three
  decision-grade dashboards in twelve weeks."
- **Manufacturing:** "Know your true cost per unit by the 5th of every month."
- **Energy:** "Forecast demand from your own meters, not from a vendor's model."
- **Retail:** "One number for stock, in every store, every morning."
- **Elevator pitch (20 words):** "Nordlys builds analytics platforms that
  mid-size companies actually use. Twelve weeks, fixed price, your team runs it
  afterwards."

## Color palette

Exact values. Copy them, never approximate. The same values are served by the
`brand-assets` MCP server (`get_palette`, `check_contrast`).

| Name         | Hex       | Role                                                             |
| ------------ | --------- | ---------------------------------------------------------------- |
| Polar Night  | `#0B1F33` | Primary dark. Headlines, dark backgrounds, wordmark on light      |
| Ice White    | `#F4F8FB` | Default light background                                         |
| Aurora Green | `#2EE6A6` | The accent. One highlight per view: key number, CTA, chart series |
| Fjord Blue   | `#1E5A8A` | Secondary. Links, secondary buttons, second chart series          |
| Slate        | `#5B6B7A` | Secondary text, borders, axis lines, captions                    |
| Ember        | `#FF6B4A` | Alerts and warnings only                                         |

Rules:

- Default look: Polar Night text on Ice White. Dark mode: Ice White text on
  Polar Night.
- Aurora Green is an accent, not a background for body text. Ice White on
  Aurora Green fails WCAG AA (ratio about 1.5:1). Polar Night on Aurora Green
  passes (about 10:1).
- Never introduce a seventh color. Use tints of Slate for depth.

## Typography

| Role     | Font                     |
| -------- | ------------------------ |
| Headings | Inter, weight 600        |
| Body     | Inter, weight 400, 16px+ |
| Code     | JetBrains Mono           |

## Logo

The logotype is [`assets/nordlys-logo.svg`](../../assets/nordlys-logo.svg)
(viewBox `0 0 640 160`, aspect ratio 4:1). Also available from the MCP tool
`get_logo_svg`.

- Clear space: at least the height of the letter N on every side.
- Minimum width: 120 px on screen, 30 mm in print.
- Do not recolor, stretch, rotate or add shadows or gradients.
- Place on Polar Night or Ice White only. On photographs, add a solid panel.

## Brand checklist

Before anything ships, confirm:

- [ ] First sentence states the result.
- [ ] Every claim has a number or a named source.
- [ ] Zero banned words (the hook reports them).
- [ ] Aurora Green appears at most once per view.
- [ ] Logo has clear space and sits on Polar Night or Ice White.
- [ ] A named next step for the reader.

For the long-form voice guide with worked examples, read
[`references/voice.md`](references/voice.md).
