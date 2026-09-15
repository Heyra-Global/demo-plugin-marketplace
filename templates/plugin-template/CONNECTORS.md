# Connectors

Skills refer to tools by category, written as `~~category`. The user
connects whatever product they use in that category.

| Category | Placeholder  | Pre-configured                    | Other options   |
| -------- | ------------ | --------------------------------- | --------------- |
| Email    | `~~email`    | Microsoft 365 (built in)          | Gmail           |
| Files    | `~~files`    | Microsoft 365 (built in)          | Google Drive    |
| <system> | `~~<system>` | <remote MCP server in .mcp.json>  | <alternatives>  |

Built-in Claude connectors (Microsoft 365, Google Workspace) need no entry
in `.mcp.json`. Remote MCP servers go into `.mcp.json` with `type: http`
and an `https://` URL. Chat and Cowork cannot run local servers.

Every skill must work without connectors, with pasted text.
