# Marketplace listing

## Name

LinkGlimpse – Social Preview Checker

## Short description

Check the current page's social cards, Google search preview, metadata, share image, redirects, and indexing signals.

## Full description

Check a page before it is shared. Open LinkGlimpse from the browser toolbar and it automatically audits the current public URL inside the popup—no URL copying, inspect button, or external report page.

See the metadata score, representative Facebook, LinkedIn, X, and Google search previews, platform readiness, page and image signals, extracted tags, and every actionable check in one place. Use it to find missing titles, descriptions, canonical URLs, Twitter Card tags, inaccessible images, poor image dimensions, and redirect problems. Every warning includes a recommendation that can be copied directly.

The extension runs only when you open it. It requests access to the active tab and the LinkGlimpse API, contains no advertising or extension analytics, and does not continuously inspect your browsing activity.

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
- Complete each store's data-use declaration using `PRIVACY.md`; for Firefox, disclose the selected page URL as required `browsingActivity` data.
- Publish the GitHub repository before submitting the marketplace listings.
