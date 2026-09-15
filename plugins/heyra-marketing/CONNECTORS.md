# Connectors

Skills in this plugin refer to tools by **category**, written as
`~~category`. The user connects whatever product they use in that category;
the skill does not care which one.

| Category  | Placeholder    | Pre-configured for Heyra              | Other options                  |
| --------- | -------------- | ------------------------------------- | ------------------------------ |
| Email     | `~~email`      | Microsoft 365 (Outlook)               | Gmail                          |
| Files     | `~~files`      | Microsoft 365 (SharePoint, OneDrive)  | Google Drive, Box              |
| Chat      | `~~chat`       | Microsoft Teams                       | Slack                          |
| Design    | `~~design`     | Canva (from the Claude connector directory) | Figma                    |
| Analytics | `~~analytics`  | none                                  | HubSpot, Amplitude             |

Microsoft 365 is a built-in Claude connector. Members turn it on under
**Customize > Connectors** in Claude Chat or Cowork. Nothing in this plugin
needs to be configured for it.

Every skill works **without** any connector: paste the text or the facts and
the skill does its job. Connectors remove the copy and paste.
