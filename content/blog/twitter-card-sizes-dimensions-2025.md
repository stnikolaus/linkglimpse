---
title: "The Ultimate Guide to Twitter Card Sizes & Dimensions for 2025"
description: "Exact Twitter Card sizes, dimensions, and aspect ratios for Summary, Summary with Large Image, App, and Player cards—plus examples, code, and best practices."
date: "2025-08-11"
author: "LinkGlimpse Team"
category: "Social Media"
tags: ["twitter", "twitter cards", "twitter card size", "twitter cards size", "twitter cards dimensions", "open graph", "meta tags"]
readTime: "10 min read"
image: "/images/blog/twitter-card-sizes-2025/hero.jpg"
---

# The Ultimate Guide to Twitter Card Sizes & Dimensions for 2025

Twitter Cards turn plain links into rich previews that drive clicks. In 2025, you’ll get the best results by using the right image dimensions and aspect ratios for each card type. This guide covers the exact specs, best practices, and copy‑paste tags.

## Twitter Card types explained
- **Summary Card**: Title, description, and a square thumbnail.
- **Summary Card with Large Image**: Title, description, and a full‑width hero image.
- **App Card**: Showcase your app with store metadata and a banner image.
- **Player Card**: Embed video/audio with a poster image and an interactive player.

## Sizes and aspect ratios (2025)

| Card type | Recommended image size (px) | Minimum size (px) | Aspect ratio | Notes |
|---|---:|---:|---:|---|
| Summary | 1200 x 1200 | 144 x 144 | 1:1 | Use a square image; keep key content centered. |
| Summary with Large Image | 1200 x 628 | 300 x 157 | 1.91:1 | The most common cross‑platform size; works great for link shares. |
| App | 1600 x 640 | 800 x 320 | 2.5:1 | Keep logos/UI centered; avoid text near edges. |
| Player (poster image) | 1280 x 720 | 640 x 360 | 16:9 | High‑contrast poster with minimal overlay text. |

Tips:
- Prefer JPG or PNG; compress for fast loads.
- Leave a safe margin around text/logos to avoid crops on mobile.
- Host images at stable URLs; version them when you update creatives.

## Visual examples (replace with your assets)
- Summary Card example: https://via.placeholder.com/1200x1200.png?text=Summary+Card+1:1
- Summary with Large Image example: https://via.placeholder.com/1200x628.png?text=Summary+Large+1.91:1
- App Card example: https://via.placeholder.com/1600x640.png?text=App+Card+2.5:1
- Player Card poster example: https://via.placeholder.com/1280x720.png?text=Player+Card+16:9

## Copy‑paste meta tags

Summary Card:
```html
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="Page title">
<meta name="twitter:description" content="Short, compelling description.">
<meta name="twitter:image" content="https://example.com/image-1200x1200.jpg">
```

Summary with Large Image:
```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Page title">
<meta name="twitter:description" content="Short, compelling description.">
<meta name="twitter:image" content="https://example.com/image-1200x628.jpg">
```

App Card:
```html
<meta name="twitter:card" content="app">
<meta name="twitter:title" content="Your App Name">
<meta name="twitter:description" content="Why users should install.">
<meta name="twitter:app:country" content="US">
<meta name="twitter:app:id:iphone" content="1234567890">
<meta name="twitter:app:id:ipad" content="1234567890">
<meta name="twitter:app:id:googleplay" content="com.example.app">
<meta name="twitter:image" content="https://example.com/app-banner-1600x640.jpg">
```

Player Card (requires a compliant player URL):
```html
<meta name="twitter:card" content="player">
<meta name="twitter:title" content="Video title">
<meta name="twitter:description" content="What viewers will see.">
<meta name="twitter:image" content="https://example.com/poster-1280x720.jpg">
<meta name="twitter:player" content="https://example.com/embed.html">
<meta name="twitter:player:width" content="1280">
<meta name="twitter:player:height" content="720">
```

## Best practices
- Title ~70 chars; description ~200 chars.
- Design for dark and light modes; prefer high contrast.
- Test on mobile to verify safe areas aren’t cropped.

## Call‑to‑Action
Tired of guessing? Test your image and preview your card instantly with our free Twitter Debugger.

[Open Twitter Debugger](/twitter-social-preview)