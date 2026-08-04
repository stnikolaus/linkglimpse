# Marketplace listing

## Name

LinkGlimpse – Social Preview Checker

## Short description

Inspect the current page's Open Graph tags, social previews, share image, redirects, and indexing signals.

## Full description

Check a page before it is shared. LinkGlimpse opens an on-demand diagnostic report for the current public URL and shows representative previews for Facebook, X, LinkedIn, Slack-style unfurls, messaging apps, and search results.

Use it to find missing titles, descriptions, canonical URLs, Twitter Card tags, inaccessible images, poor image dimensions, and redirect problems. Every warning includes an actionable recommendation.

The extension runs only when you click it. It requests minimal permissions, contains no advertising, and does not continuously inspect your browsing activity.

## Category

Developer Tools

## Required listing assets

- 128×128 extension icon
- 440×280 small promotional tile for Chrome
- At least three 1280×800 screenshots: popup, preview tabs, diagnostics/fixes
- Firefox icon and screenshots
- Support URL: `https://github.com/stnikolaus/linkglimpse/issues`
- Privacy policy: `https://www.linkglimpse.com/privacy`

## Submission checklist

- Build and test both packages with `pnpm extension:package`.
- Verify the Chrome ZIP by loading it unpacked.
- Verify the Firefox ZIP with `web-ext lint` or AMO's validator.
- Confirm the version in both generated manifests.
- Complete each store's data-use declaration using `PRIVACY.md`.
- Publish the GitHub repository before submitting the marketplace listings.
