---
name: palette-lookup
description: A colour question must return the exact Nordlys hex value and the correct contrast advice from the brand-guidelines skill.
tags: [smoke, palette]
runs: 2
max_turns: 6
timeout_seconds: 180
allowed_tools: [Read, Glob, Grep, Skill]
expected_outcome: The answer names Aurora Green #2EE6A6 as the accent and says that Ice White body text on Aurora Green does not pass WCAG AA, and recommends Polar Night text instead.
---
What is the hex value of the Nordlys Analytics accent colour? And can I put Ice White body text on top of it on a slide?
