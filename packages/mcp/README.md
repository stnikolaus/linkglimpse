# LinkGlimpse MCP

[LinkGlimpse](https://www.linkglimpse.com/) gives AI agents structured metadata diagnostics and visual previews for public web pages.

Unlike metadata-only tools, `render_previews` returns a PNG that shows how the live title, description, domain and share image are likely to appear across major platforms and Google search.

## Install

```bash
npx -y linkglimpse-mcp
```

Claude Code:

```bash
claude mcp add linkglimpse -- npx -y linkglimpse-mcp
```

Claude Desktop, Cursor and other stdio clients:

```json
{
  "mcpServers": {
    "linkglimpse": {
      "command": "npx",
      "args": ["-y", "linkglimpse-mcp"]
    }
  }
}
```

## Tools

- `audit_url` — inspect metadata, redirects, canonical, robots, share-image quality and platform readiness.
- `audit_urls` — audit up to 20 URLs with bounded concurrency.
- `compare_urls` — compare production/staging or before/after metadata.
- `get_fix_plan` — return actionable fixes and a guarded coding-agent prompt.
- `render_previews` — return one visual preview or a PNG contact sheet covering Facebook, X, LinkedIn, Slack, Discord, WhatsApp and Google search.

Previews are deterministic models based on the live metadata. Platforms can apply different crops, fallbacks and cached values.

## Privacy and security

The server has no analytics or telemetry. It fetches only URLs explicitly supplied to a tool. Private, local and reserved network destinations are blocked, including redirects to those destinations. Response sizes, timeouts and redirect counts are bounded.

## License

AGPL-3.0-or-later
