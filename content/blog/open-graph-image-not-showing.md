---
title: "Open Graph Image Not Showing? Diagnose and Fix og:image"
description: "Find why an Open Graph image is missing from social previews and fix URL, HTTP response, format, dimensions, redirects, HTML, or cache problems."
date: "2026-08-03"
author: "LinkGlimpse Team"
category: "Troubleshooting"
tags: ["open graph image", "og:image", "social preview", "debugging", "meta tags"]
readTime: "10 min read"
image: "/images/blog/open-graph-image-not-showing/hero.jpg"
featured: true
---

When an Open Graph image is not showing, test the image as a separate public resource instead of changing random metadata until the preview works.

Paste the page into the **[Open Graph Checker](/open-graph-checker)**. The report extracts `og:image`, resolves it against the final page URL, requests the asset, and reports its response type, byte size, and detectable dimensions.

## Use an Absolute HTTPS URL

The safest implementation is an absolute URL:

```html
<meta property="og:image" content="https://example.com/images/social-card.jpg" />
```

A browser can resolve `/images/social-card.jpg`, but social crawlers do not all behave identically. Absolute HTTPS values remove ambiguity and prevent mixed-protocol problems.

## Confirm the Image Returns an Image

Request the exact image URL—not the page URL. A healthy response usually has:

- A 2xx status
- A content type such as `image/jpeg`, `image/png`, or `image/webp`
- No login, cookie, referer, or expiring-token requirement
- No HTML challenge page from a CDN or firewall
- A stable final URL after any redirects

An image route can display in your logged-in browser while returning `403`, `404`, or HTML to a crawler. That is why the response inspection matters.

## Declare Useful Image Metadata

Platforms can inspect the file themselves, but explicit dimensions help them understand the asset quickly:

```html
<meta property="og:image" content="https://example.com/images/social-card.jpg" />
<meta property="og:image:secure_url" content="https://example.com/images/social-card.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Dashboard showing the report described on this page" />
```

Do not declare dimensions that differ from the real file. Generate the correct asset or update the metadata.

## Choose a Safe Size and Aspect Ratio

A 1200×630 image at approximately 1.91:1 is a strong cross-platform default. It is large enough for prominent previews and familiar to Facebook, LinkedIn, and large Twitter/X cards.

Square or portrait assets may be cropped, reduced to a thumbnail, or rejected by a layout that expects a landscape card. See **[Open Graph image sizes by platform](/blog/open-graph-image-size)** before designing a template.

## Put the Tag in the Initial HTML

Social crawlers fetch HTML; they do not reliably wait for your client application to generate head tags. Check View Source and find `og:image` in the response.

For Next.js App Router, use page metadata:

```tsx
export const metadata = {
  openGraph: {
    images: [{
      url: 'https://example.com/images/social-card.jpg',
      width: 1200,
      height: 630,
      alt: 'A useful description',
    }],
  },
};
```

## Remove Duplicate or Empty og:image Tags

Inspect every `og:image` tag in the raw HTML. A plugin might emit an empty tag before your correct one, or a layout may provide a generic image in addition to the page-specific image.

Use one authoritative image unless you deliberately provide a supported sequence of alternatives. Keep `twitter:image` consistent unless X needs a different crop.

## Check Redirects and Canonicals

The requested URL, final URL, `og:url`, and canonical should describe the same intended page. If a campaign URL redirects to a canonical page whose metadata points elsewhere, caches may become fragmented across several addresses.

Link directly to the final page and use a stable self-referencing canonical. Avoid redirect chains for the page and the image.

## Know When the Problem Is Cache

If the live HTML still contains the old image, it is not a platform cache problem—fix the application or CDN first. If the live HTML and image response are correct but a platform shows the old card, request a fresh scrape through that platform's official debugger where available.

Changing the image filename is a last-resort cache-busting technique, not a substitute for correct headers and metadata. If you create a new URL, update both `og:image` and `twitter:image` consistently.

## og:image Debugging Checklist

1. Run the page through the checker.
2. Copy the exact extracted image URL.
3. Open it privately and inspect its HTTP response.
4. Confirm real dimensions, type, and file size.
5. Find one authoritative tag in the initial HTML.
6. Align the requested URL, final URL, `og:url`, and canonical.
7. Deploy and re-run the checker before refreshing a platform cache.

Use the **[Open Graph Checker](/open-graph-checker)** to copy the suggested fix, create a shareable report, or generate a repair prompt for an AI coding agent.

Related: **[Complete Open Graph tag examples](/blog/open-graph-tags-guide)** and **[Facebook preview wrong or missing](/blog/facebook-link-preview-wrong)**.
