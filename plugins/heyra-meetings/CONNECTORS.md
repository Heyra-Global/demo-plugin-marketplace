# Connectors

Skills refer to tools by category, written as `~~category`.

| Category      | Placeholder      | Pre-configured for Heyra                      | Other options            |
| ------------- | ---------------- | --------------------------------------------- | ------------------------ |
| Calendar      | `~~calendar`     | Microsoft 365 (Outlook calendar)              | Google Calendar          |
| Email         | `~~email`        | Microsoft 365 (Outlook mail)                  | Gmail                    |
| Chat          | `~~chat`         | Microsoft Teams                               | Slack                    |
| Files         | `~~files`        | Microsoft 365 (SharePoint, OneDrive)          | Google Drive             |
| Transcripts   | `~~transcripts`  | Fireflies (remote MCP server in `.mcp.json`)  | Teams meeting recap (paste), Otter |

Microsoft 365 is a built-in Claude connector: **Customize > Connectors**.
Fireflies is a remote MCP server declared in this plugin's `.mcp.json`; the
user connects it once and signs in. It is optional. Paste a Teams recap or
your own notes instead and every skill still works.

## What the skills never do

- Post to a Teams channel or send a mail without asking first.
- Put player data, account details or national ID numbers into minutes.
