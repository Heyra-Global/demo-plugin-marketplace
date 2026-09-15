---
type: llm
focus: last_message
weight: 2
---
Judge the Facebook post in the final message. Pass only if ALL hold:

1. The post is in Danish.
2. The first sentence names the draw (Ugens Tal, lørdag) rather than the
   money.
3. The prize pool appears exactly once, as "30 mio. kr." or an equivalent
   exact form, and no other amount is invented.
4. The post body (excluding the block) is under 80 words.
5. There is no countdown pressure ("sidste chance", "kun i dag", "skynd
   dig").
6. At most one emoji and at most three hashtags.

Fail if any item is missing; name the item in one sentence.
