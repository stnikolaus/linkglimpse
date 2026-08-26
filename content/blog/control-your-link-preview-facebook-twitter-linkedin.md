---
title: "How to Control Your Link Preview on Facebook, Twitter, and LinkedIn"
description: "Fix wrong images, missing descriptions, and stale link previews. A step‑by‑step guide to find, edit, and test the meta tags that control social previews."
date: "2025-08-11"
author: "LinkGlimpse Team"
category: "Social Media"
tags: ["linkedin link preview", "linkedin preview", "facebook preview", "preview tweets", "twitter preview tweet", "open graph", "twitter cards"]
readTime: "10 min read"
image: "/images/blog/control-link-previews/hero.jpg"
---

# How to Control Your Link Preview on Facebook, Twitter, and LinkedIn

“Why does my link look wrong when I share it?” Because platforms read—and cache—your meta tags. Here’s how to fix previews fast.

## Step‑by‑step: find, edit, and test your preview
1. **Inspect your current preview**
   - Paste your URL into a preview/validator to see exact title, description, and image.
2. **Add or correct meta tags**
   - Ensure `og:title`, `og:description`, `og:image`, `og:url` are present.
   - Add `twitter:card` (usually `summary_large_image`) and `twitter:image`.
3. **Use the right image size**
   - Cross‑platform safe: 1200 x 630 (1.91:1) for link shares.
   - Keep vital content centered; avoid text near edges.
4. **Publish changes and deploy**
   - Ensure tags live in `<head>` on the canonical URL.
   - Don’t block bots with `robots.txt` or meta robots.
5. **Force a refresh (re‑scrape)**
   - Facebook: use Sharing Debugger.
   - LinkedIn: use Post Inspector.
   - Twitter/X: use Card Validator (Debugger).
6. **Bust caches if needed**
   - Change the image URL (e.g., `image-v2.jpg` or `?v=2`).
7. **Re‑test and confirm**
   - Validate on all three platforms; check both light/dark modes if relevant.

Minimal universal example:
```html
<meta property="og:title" content="Your Page Title">
<meta property="og:description" content="Clear, benefit‑driven copy that matches the page.">
<meta property="og:image" content="https://example.com/og-1200x630.jpg">
<meta property="og:url" content="https://example.com/page">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:image" content="https://example.com/og-1200x630.jpg">
```

## Troubleshooting quick hits
- HTTP 200, public access, HTTPS.
- Absolute image URLs with correct `Content-Type`.
- Avoid heavy images; keep under a few MB.

## Call‑to‑Action
Stop sharing blind. Preview your link for Facebook, Twitter, and LinkedIn before you post with our free preview tool.

[Open Social Preview Tool](/)