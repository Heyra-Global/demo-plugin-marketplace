# Connectors

Skills refer to tools by category, written as `~~category`.

| Category    | Placeholder     | Pre-configured for Heyra                          | Other options                    |
| ----------- | --------------- | ------------------------------------------------- | -------------------------------- |
| Files       | `~~files`       | Microsoft 365 (SharePoint, OneDrive)              | Google Drive, Box                |
| Email       | `~~email`       | Microsoft 365 (Outlook)                           | Gmail                            |
| Tickets     | `~~tickets`     | Atlassian Jira (remote MCP server in `.mcp.json`) | ServiceNow, Zendesk              |
| Wiki        | `~~wiki`        | Atlassian Confluence (same server)                | SharePoint pages, Notion         |
| HR system   | `~~hr-system`   | none (custom connector)                           | Workday, Personio, Sympa         |
| Finance     | `~~finance`     | none (custom connector)                           | Business Central, e-conomic, SAP |

Microsoft 365 is a built-in Claude connector. Atlassian is a remote MCP
server declared in `.mcp.json`. HR and finance systems vary; an admin adds a
custom connector and the skills keep working because they only refer to the
category.

Every skill works with pasted documents when no connector is available.

## Data rules that apply to every skill here

- Personnel data stays in the HR system. Skills quote a case or employee
  number, never salary or health details, in any document they write.
- Contract and invoice texts may contain supplier details; they never
  contain player data.
