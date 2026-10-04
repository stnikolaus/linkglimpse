---
title: "What Are Open Graph & Twitter Card Meta Tags? A Complete Guide"
description: "Simple explanation of Open Graph and Twitter Card tags with copy‑paste examples, best practices, and platform differences for Facebook, LinkedIn, and Twitter."
date: "2025-08-11"
author: "LinkGlimpse Team"
category: "Technical SEO"
tags: ["open graph tags", "open graph meta tags best practices", "linkedin meta tags", "twitter card meta", "meta twitter card", "social previews"]
readTime: "11 min read"
image: "/images/blog/og-twitter-meta-tags-guide/hero.jpg"
---

# What Are Open Graph & Twitter Card Meta Tags? A Complete Guide

Open Graph (OG) and Twitter Card tags control how your links look across social networks. Add them once, and your content will share consistently—titles, descriptions, and images included.

## What each platform uses
- **Facebook**: Primarily Open Graph.
- **LinkedIn**: Primarily Open Graph; falls back to page content if missing.
- **Twitter**: Twitter Card tags; falls back to OG if a matching Twitter tag isn’t present.

## Must‑have tags (copy‑paste)

Basic Open Graph:
```html
<meta property="og:title" content="Your Page Title">
<meta property="og:description" content="A clear, benefit‑driven description.">
<meta property="og:image" content="https://example.com/og-1200x630.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="article">
```

Twitter Card (large image preview):
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Your Page Title">
<meta name="twitter:description" content="A clear, benefit‑driven description.">
<meta name="twitter:image" content="https://example.com/og-1200x630.jpg">
<meta name="twitter:site" content="@yourhandle">
```

Optional but helpful:
```html
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:locale" content="en_US">
<meta property="article:published_time" content="2025-01-01T00:00:00Z">
```

## Best practices for OG and Twitter meta tags
- Use `og:image` at 1200 x 630 (1.91:1) for broad compatibility.
- Keep `og:title` succinct and specific; avoid clickbait.
- Write `og:description` like ad copy; lead with value.
- Ensure every shareable page has unique metadata and imagery.

## Platform nuances
- **Facebook** caches aggressively—use its Sharing Debugger to refresh previews.
- **LinkedIn** respects OG; 1200 x 627–630 images render crisp.
- **Twitter** prefers `summary_large_image` for link shares.

## Troubleshooting checklist
- Page returns HTTP 200 and is publicly accessible.
- No blocking via `robots.txt` or meta robots.
- Absolute URLs for images with correct `Content-Type`.
- Images under a few MB and served quickly over HTTPS.

## Call‑to‑Action
Once you’ve added the tags, see them in action! Preview your URL with our All‑in‑One Social Preview Tool.

[Open Social Preview Tool](/)