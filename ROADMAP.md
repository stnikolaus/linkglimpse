# LinkGlimpse roadmap

This roadmap communicates direction, not a promise of dates. Maintainers may reorder work based on security, reliability, platform changes, and demonstrated usage.

## Now: open-source distribution

- Publish the `linkglimpse` npm CLI with human-readable and CI output.
- Publish the minimal-permission extension to Chrome Web Store and Firefox Add-ons.
- Publish the multimodal MCP server to npm and the official MCP Registry.
- Publish the visual metadata auditor to Apify Store for API, scheduled, and Apify MCP workflows.
- Establish reproducible CI, release artifacts, contribution templates, and private vulnerability reporting.
- Track completed reports by distribution source without adding telemetry to the CLI or extension itself.

## Next: better developer workflows

- Continue expanding the reusable diagnostic and visual-preview engine shared by the website, MCP server, and Apify Actor.
- Add optional local HTML and localhost inspection to the CLI and extension.
- Add a GitHub Action for metadata regression checks.
- Add stable JSON schema documentation and versioning.
- Expand fixtures and automated tests for malformed metadata and image formats.

## Later: recurring quality checks

- Sitemap-wide audits with controlled concurrency.
- Scheduled checks and change notifications.
- Share-image crop-safe-area guidance.
- Community-maintained platform compatibility notes.
- Import/export formats for common SEO and content workflows.

## Non-goals

- Claiming pixel-perfect parity with private social platform clients.
- Bypassing platform caches, authentication, robots controls, or crawler protections.
- Collecting browsing history through the browser extension.
