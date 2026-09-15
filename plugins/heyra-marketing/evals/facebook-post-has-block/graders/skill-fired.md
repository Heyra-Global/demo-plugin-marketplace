---
type: tool_used
tool: Skill
input_match: "brand-voice|social-post|compliance-check"
min: 1
arm: with-only
weight: 1
---
Claude must load one of the plugin's marketing skills before writing.
`arm: with-only` marks this as a "did the plugin fire" indicator that is not
scored in the no-plugin baseline arm.
