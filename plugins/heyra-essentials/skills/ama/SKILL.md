---
name: ama
description: "Interview the user to clarify, explore, or refine an underspecified idea, task, decision, or desired outcome. Use whenever the user invokes /ama, says 'interview me', asks to be interviewed or quizzed, wants guided questioning, is unsure what they want, or would benefit from progressively discovering the right answer. In Claude.ai, presents each round of questions as one interactive inline widget (visualize:show_widget) that the user clicks through and submits; falls back to the tappable question tool (ask_user_input_v0) only where the widget is unavailable. For an overview of the Heyra plugins and skills see plugin-help."
---

Interview me to clarify, develop, or refine what I want until you have enough information to give me a strong response or we have reached a shared understanding.

## How to ask

Work in rounds. Each round is one interactive widget holding 5 to 8 questions. I click through it and submit; my answers arrive as my next message. Read them, decide what to ask next, and render the next round. Do not follow a fixed questionnaire.

### Before the first round

Write one or two sentences saying what you understood and what the interview is for. No preamble beyond that.

### Rendering a round

1. Call `visualize:read_me` with `modules: ["interactive"]` once per conversation (silently, never mention it).
2. Read `assets/widget-template.html` and fill in the `QUESTIONS` array and `ROUND` number. Keep the template's structure, styling, and script unchanged; only the data changes.
3. Call `visualize:show_widget` with the filled template. Title it `ama_round_N`.
4. After the widget, write at most one line ("Click through and submit when done"). Then end your turn. Do not stack tool calls, do not keep writing, do not answer the questions yourself.

### Question design

Each question needs:

- `q`: the question, one sentence, sentence case.
- `why`: one short line on why the answer matters to the outcome. Shown under the question.
- `key`: a short slug used in the submitted answers.
- `options`: 2 to 4 entries with `label` (2 to 6 words) and optional `desc` (what picking it implies). Options must be mutually exclusive unless `multi` is true.
- `rec`: the index of your recommended option, or null if you have no opinion. Exactly one recommendation per question at most.
- `multi`: true when several answers can be right at once.

Every question automatically gets a free-text "other" field and a Skip button, so do not add "Other" as an option.

Order questions from most to least consequential. Do not ask anything I have already answered or that you can determine yourself.

### Reading answers

The submitted message looks like:

```
Interview round 2 answers:
Q1 (audience): internal team — note: "mostly sales"
Q2 (format): skipped
Q3 (channels): slack, email
```

Treat "skipped" as "no preference, use your judgment". Treat notes as overriding the picked option when they conflict.

### Free-form questions

If a question genuinely needs a name, number, or paragraph, give it a single option labelled "Type it in notes" and set `rec` to null; the notes field carries the answer.

## Fallback

If `visualize:show_widget` is not available in the session, use the tappable question tool (`ask_user_input_v0` or the surface's equivalent), one question per turn, with a short lead-in naming your recommendation. Only if neither tool exists, ask in prose.

## When to stop

Stop interviewing once additional questions are unlikely to materially improve the result. Then go straight to the task. Do not write a summary of the answers first; fold them into the work.
