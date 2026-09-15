# Connectors

Skills refer to tools by category, written as `~~category`.

| Category | Placeholder   | Pre-configured for Heyra                     | Other options                          |
| -------- | ------------- | -------------------------------------------- | -------------------------------------- |
| CRM      | `~~CRM`       | HubSpot (remote MCP server in `.mcp.json`)   | Dynamics 365 (custom connector), Salesforce |
| Email    | `~~email`     | Microsoft 365 (Outlook)                      | Gmail                                  |
| Calendar | `~~calendar`  | Microsoft 365 (Outlook calendar)             | Google Calendar                        |
| Files    | `~~files`     | Microsoft 365 (SharePoint, OneDrive)         | Google Drive                           |
| Web      | `~~web`       | Claude's built-in web search                 |                                        |

Microsoft 365 is a built-in Claude connector. HubSpot is a remote MCP server
declared in `.mcp.json`; the user connects it once. A company on Dynamics 365
replaces that entry with its own custom connector URL; the skills do not
change, because they only say `~~CRM`.

Every skill works without connectors: paste the CRM record, the mail or the
notes.
