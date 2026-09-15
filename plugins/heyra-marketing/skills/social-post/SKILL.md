---
name: social-post
description:
  Write a social media post for Heyra - Facebook or Instagram for players,
  LinkedIn for the company, Teams for colleagues - in the Heyra voice, with
  the mandatory responsible-gaming block where required, in Danish or
  English, with three alternative openings. Use when the user asks for a
  post, a caption, a social update or a short announcement. For the rules see
  brand-voice, for a whole campaign see campaign-brief, and run
  compliance-check on paid or player-facing posts.
argument-hint: "<topic or facts> [--platform facebook|instagram|linkedin|teams] [--lang da|en]"
---

# Social post

Input: `$ARGUMENTS`

## Steps

1. Load the `brand-voice` skill if it is not in context.
2. Decide the platform (default Facebook) and the language (default the
   user's language; Danish for player-facing posts unless told otherwise).
3. Get the facts: product, date, amount, price, odds if any. If a number is
   missing and the post needs it, ask one question. Do not invent numbers.
4. Write the post with the format in
   [`templates/post-formats.md`](templates/post-formats.md) for that
   platform.
5. Player-facing posts (Facebook, Instagram, and any post that promotes a
   game) end with the mandatory block from brand-voice, on its own line,
   complete. LinkedIn corporate and Teams posts do not promote games and
   do not carry the block.
6. Self-check against the avoid list. Remove every hit.
7. Deliver:

```markdown
## Post (<platform>, <language>)

<the post, ready to paste>

## Alternative openings
1. ...
2. ...
3. ...

## Notes
- Facts used and their source
- Block: <included | not needed because ...>
- Next step: run compliance-check before scheduling (player-facing)
```

## Hard rules

- Under 80 words for Facebook and Instagram, under 120 for LinkedIn.
- At most three hashtags. At most one emoji, none in the block.
- Never "vind" or "win" as the first word. Name the game or the occasion.
- Never target or picture anyone who looks under 25.
- Never a countdown, "sidste chance" or "kun i dag".
- No link in the text; a link placeholder as the last line before the block.
