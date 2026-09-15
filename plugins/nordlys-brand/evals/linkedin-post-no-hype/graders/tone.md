---
type: llm
focus: last_message
weight: 2
---
Judge the LinkedIn post in the final message. Pass only if ALL of the following
hold:

1. The first line states a result or a concrete tension, not an announcement
   such as "I'm excited to announce" or "We are thrilled".
2. The post contains the figures 9 and 4 (the month-end close improvement) or
   an equivalent concrete number taken from the prompt. No invented numbers.
3. There are at most three hashtags.
4. There is at most one emoji.
5. The post ends with a question to the reader or a single named next step.
6. The post is under 150 words (count the post body only, not any notes).

Fail if any item is missing. Explain which item failed in one sentence.
