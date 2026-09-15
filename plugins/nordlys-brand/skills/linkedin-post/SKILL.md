---
name: linkedin-post
description:
  Write a LinkedIn post in the Nordlys Analytics voice from a topic, a link or
  rough notes. Use when the user asks for a LinkedIn post, a social post or a
  short public announcement. For the underlying rules see brand-guidelines, to
  audit a finished draft see brand-check, and for a full campaign one-pager see
  campaign-brief.
argument-hint: "<topic or notes> [--audience cto|data-lead|founder|ops]"
disable-model-invocation: true
---

# Write a LinkedIn post

User input: `$ARGUMENTS`

This skill is user-invoked only (`disable-model-invocation: true`), so it runs
when someone types `/nordlys-brand:linkedin-post`. Claude never starts it on
its own.

## Steps

1. **Load the rules.** Invoke the `nordlys-brand:brand-guidelines` skill if it
   is not already in context. Note the audience register from
   `references/voice.md` if `--audience` was given. Default audience: data
   lead.
2. **Find the number.** Every Nordlys post contains one concrete number. If the
   input has none, ask the user for one with a single question. Do not invent
   figures.
3. **Draft with the template** in
   [`templates/post-structure.md`](templates/post-structure.md): hook line of
   at most 12 words, two to four short paragraphs, one result with a number,
   one question or next step, at most three hashtags.
4. **Self-check.** Compare the draft with the banned list (the `brand-assets`
   MCP tool `get_banned_words`, or `assets/banned-words.json`). Remove every
   hit. Confirm the first sentence carries the conclusion.
5. **Deliver** in this shape:

```markdown
## Post

<the post, ready to paste, under 150 words unless the user asked for more>

## Alternative hooks

1. <hook A>
2. <hook B>
3. <hook C>

## Notes

- Audience: <register used>
- Number used: <the figure and its source as given by the user>
```

## Hard rules

- Never write "I'm excited to announce". Start with the reader's problem or
  the number.
- No emoji unless the user asked for a light tone, and then at most one.
- No links inside the text. Put a link placeholder as the last line if the
  user supplied one.
- If the user pastes a draft, keep their facts and rewrite the language. Do
  not add claims.
