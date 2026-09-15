---
type: regex
target: last_message
match: not_contains
flags: i
weight: 3
pattern: "\\b(revolutionary|game[- ]chang\\w*|cutting[- ]edge|synerg\\w*|leverage|unlock|seamless\\w*|next-level|disrupt\\w*|supercharge|empower|delve|world-class|best-in-class|10x|unleash|elevate|robust|holistic|paradigm|state-of-the-art)\\b"
---
The final message must not contain any word from the Nordlys banned list.
This grader is deterministic and free: it is a regular expression over the last
message. Weight 3 makes it the most important grader in the case.
