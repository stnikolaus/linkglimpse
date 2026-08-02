# Product analytics

LinkGlimpse sends the same intentional product events to Plausible and, when configured, PostHog. Submitted URLs are reduced to their hostname before analytics capture; full submitted URLs are not sent as event properties.

## PostHog

The configured PostHog project is `539121`. Copy `.env.example` to `.env.local`, rotate the exposed project token, and add the new value as `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`. Set `NEXT_PUBLIC_POSTHOG_HOST` to the ingestion host for the project region (`https://us.i.posthog.com` or `https://eu.i.posthog.com`).

The client is configured for explicit product events and SPA pageviews. Automatic element capture and session recording are disabled.

## Plausible goals

Create these custom event goals in the Plausible site settings for `linkglimpse.com`:

- `Preview Started`
- `Preview Succeeded` — primary activation goal
- `Preview Failed`
- `Report Exported` — strong value signal
- `Bulk Processing Started`
- `Bulk Processing Succeeded`
- `Bulk Report Exported`
- `API Test Completed`
- `Platform Navigation`

Useful event properties include `surface`, `url_domain`, `diagnostic_score`, `duration_ms`, `success_rate`, `format`, and `url_count`.

The first product funnel to monitor is:

1. `Preview Started`
2. `Preview Succeeded`
3. `Report Exported`

Track preview success rate, median diagnostic score, report export rate, repeat activated visitors, and bulk-processing success alongside traffic.
