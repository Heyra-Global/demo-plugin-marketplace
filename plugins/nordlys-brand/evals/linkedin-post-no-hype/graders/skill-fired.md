---
type: tool_used
tool: Skill
input_match: "brand|linkedin"
min: 1
arm: with-only
weight: 1
---
Claude must load one of the plugin's brand skills (brand-guidelines or
linkedin-post) before writing. `arm: with-only` marks this as a "did the plugin
fire" indicator: it is only meaningful in the arm that has the plugin
installed, so the no-plugin baseline arm does not get penalised for it.
