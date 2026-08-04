# Visual Social Preview & Open Graph Auditor

See the result instead of reading raw tags. This Actor inspects public URLs, renders a visual preview sheet, scores metadata health and returns concrete fixes that developers or AI agents can apply.

## What makes this Actor different

Metadata extraction alone does not show whether a card will look right. Each successful audit can generate a PNG contact sheet covering:

- Facebook
- X / Twitter
- LinkedIn
- Slack
- Discord
- WhatsApp
- Google search

The previews are deterministic models built from the live title, description, domain and share image. They do not use generative AI. A platform can still apply its own crop, fallback or cached value.

## Results

Every dataset row includes:

- A weighted metadata score and pass, warning and failure counts
- HTTP status and redirect information
- Resolved title, description and share image
- Canonical and robots signals
- Share-image reachability, type, size, dimensions and aspect ratio
- Open Graph and Twitter Card checks
- Platform readiness
- Concrete remediation snippets for every warning or failure
- A link to the generated PNG preview stored with the run

## Input

Provide one to 100 public URLs. Choose a preview contact sheet or one specific platform, and optionally disable preview rendering for a faster metadata-only run.

```json
{
  "urls": [
    "https://example.com/",
    "https://example.com/article"
  ],
  "renderPreviews": true,
  "previewPlatform": "all",
  "concurrency": 4
}
```

## AI agents and automation

The input and output schemas are designed for APIs, scheduled audits, no-code workflows and Apify MCP. Agents can inspect the structured checks, retrieve the PNG preview when visual reasoning is useful, and apply the returned fix plan.

## Security and privacy

The Actor processes only URLs explicitly supplied in a run. Private, local and reserved network destinations are blocked, including unsafe redirect targets. Requests have bounded timeouts, redirect counts and response sizes. No browser history, cookies or credentials are collected.
