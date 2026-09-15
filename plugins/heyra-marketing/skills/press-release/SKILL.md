---
name: press-release
description:
  Write a press release or press statement for Heyra in Danish or English -
  new products, results, partnerships, winner stories with consent, and
  reactive statements - in the neutral press register with one spokesperson
  and the standard boilerplate. Use when the user asks for a press release,
  a statement, a quote for a journalist or a media Q&A. For the voice see
  brand-voice, for social distribution see social-post, and run
  compliance-check when the release promotes a game.
argument-hint: "<subject and facts> [--type release|statement|qa] [--lang da|en]"
---

# Press release

Input: `$ARGUMENTS`

## Steps

1. Load `brand-voice`. Use the **press register**: neutral, factual, one
   spokesperson, no marketing adjectives.
2. Collect the facts with sources. Ask at most one question if a key fact
   (date, number, name of the spokesperson) is missing.
3. Use the structure in [`templates/press-release.md`](templates/press-release.md).
   Lead paragraph under 40 words and answers who, what, when, where.
4. Quotes: one from the spokesperson, optionally one from a partner. Quotes
   say something a person would say; no "we are thrilled".
5. Winner stories: only with the winner's **written consent** on file. Use
   the name and details the winner approved, nothing more. Prizes above DKK
   1 million involve Vinderservice; mention their advice in one line if the
   winner agreed.
6. Add the boilerplate and the press contact placeholder from the template.
7. If the release promotes a game or names a prize pool, add the mandatory
   block after the boilerplate and suggest `compliance-check`.
8. Deliver the release, then a short list of the facts and their sources.

## Reactive statements (`--type statement`)

- Three short paragraphs: what happened, what Heyra does about it, whom to
  contact.
- Never speculate about causes. Never name players or employees.
- If the subject touches responsible gaming, AML, or a regulator, say that
  Heyra is in dialogue with the Danish Gambling Authority and stop there.

## Media Q&A (`--type qa`)

Ten likely questions with two-sentence answers, in the press register, with
"we do not comment on individual players" where relevant.
