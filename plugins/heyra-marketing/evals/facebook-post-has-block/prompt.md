---
name: facebook-post-has-block
description: A player-facing post request must trigger the marketing skills and produce a post with the mandatory responsible-gaming block, exact numbers and no banned words.
tags: [smoke, marketing, compliance]
runs: 2
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: A Danish Facebook post for the Saturday draw with the 18+, StopSpillet and ROFUS block on its own line, the prize pool stated once as "30 mio. kr.", no words from the avoid list, under 80 words.
---
Skriv et Facebook-opslag om lørdagens Ugens Tal-trækning. Puljen er 30 mio. kr. Sidste salg er kl. 18. Hold det kort.
