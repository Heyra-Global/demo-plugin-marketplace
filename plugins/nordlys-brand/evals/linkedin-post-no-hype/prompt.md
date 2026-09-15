---
name: linkedin-post-no-hype
description: A marketing request must trigger the brand skills and produce a post without banned hype words, with one concrete number and at most three hashtags.
tags: [smoke, marketing]
runs: 2
max_turns: 10
timeout_seconds: 300
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: A LinkedIn post in the Nordlys voice. No banned words, the first line states the result, one number, at most three hashtags, under 150 words.
---
Write a LinkedIn post announcing that Nordlys Analytics now offers Microsoft Fabric migrations for mid-size manufacturers. Our last migration took a 400-person machinery maker from a 9-day month-end close to 4 days. Audience: CTOs. Keep it under 150 words.
