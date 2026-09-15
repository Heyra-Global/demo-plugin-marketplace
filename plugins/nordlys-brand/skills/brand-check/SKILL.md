---
name: brand-check
description:
  Review a document or a pasted draft against the Nordlys Analytics brand
  guidelines and return a scored report with concrete fixes. Runs in an
  isolated brand-reviewer subagent, so the review does not fill the main
  conversation. Use when the user asks to check, review or audit copy for brand
  compliance, or after linkedin-post or campaign-brief produced a draft. For
  the rules themselves see brand-guidelines.
argument-hint: "<file path, or pasted text>"
context: fork
agent: brand-reviewer
---

Review the following against the Nordlys Analytics brand guidelines. If it is
a file path, read the file first. If it is text, review the text as given.

Input: $ARGUMENTS

Return the report in the format your system prompt defines. Do not modify any
file. The user applies the fixes.
