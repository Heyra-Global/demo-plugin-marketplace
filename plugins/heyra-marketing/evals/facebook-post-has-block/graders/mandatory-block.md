---
type: regex
target: last_message
match: contains
flags: i
weight: 3
pattern: "18\\+[^\\n]*StopSpillet[^\\n]*ROFUS"
---
The post must carry the mandatory block on one line: the 18+ mark, the
StopSpillet reference and the ROFUS reference. Without the plugin, Claude
does not know this block is required.
