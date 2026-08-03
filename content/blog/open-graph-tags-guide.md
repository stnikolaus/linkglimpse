---
title: "Open Graph Tag Examples and Templates for Every Page"
description: "Copy complete Open Graph tag templates for HTML, Next.js and WordPress, including Twitter Cards, article metadata, images, canonicals, and validation steps."
date: "2025-01-10"
updated: "2026-08-03"
author: "LinkGlimpse Team"
category: "Technical SEO"
tags: ["open graph tags", "og tag template", "open graph example", "next.js metadata", "twitter cards"]
readTime: "12 min read"
image: "/images/blog/open-graph-tags-guide/hero.jpg"
featured: true
---

A complete Open Graph implementation gives social platforms an explicit title, description, image, content type, and canonical share URL instead of making them guess.

Copy the closest template below, replace every placeholder, deploy it in the initial HTML response, and validate the result with the **[Open Graph Checker](/open-graph-checker)**.

## Complete HTML Open Graph Template

This baseline works for a typical landing page:

```html
<title>Specific browser and search title</title>
<meta name="description" content="A concise search description for this page." />
<link rel="canonical" href="https://example.com/page" />

<meta property="og:title" content="Specific social preview title" />
<meta property="og:description" content="A concise reason to open this page." />
<meta property="og:type" content="website" />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:site_name" content="Example" />
<meta property="og:locale" content="en_US" />

<meta property="og:image" content="https://example.com/images/social-card.jpg" />
<meta property="og:image:secure_url" content="https://example.com/images/social-card.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="A useful description of the social card" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Specific social preview title" />
<meta name="twitter:description" content="A concise reason to open this page." />
<meta name="twitter:image" content="https://example.com/images/social-card.jpg" />
<meta name="twitter:image:alt" content="A useful description of the social card" />
```

The browser title and social title can differ, but they should describe the same destination. Keep one authoritative set of tags and use absolute HTTPS URLs.

## Minimum Open Graph Template

If you need the smallest useful implementation:

```html
<meta property="og:title" content="Page title" />
<meta property="og:description" content="Page description" />
<meta property="og:image" content="https://example.com/social-card.jpg" />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />
```

Do not omit normal search metadata and a canonical merely because social cards can render without them. Those signals help keep the page identity coherent.

## Next.js App Router Metadata Example

Use the native Metadata API in a Server Component:

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Specific browser and search title',
  description: 'A concise search description for this page.',
  alternates: {
    canonical: '/page',
  },
  openGraph: {
    title: 'Specific social preview title',
    description: 'A concise reason to open this page.',
    type: 'website',
    url: '/page',
    siteName: 'Example',
    images: [{
      url: '/images/social-card.jpg',
      width: 1200,
      height: 630,
      alt: 'A useful description of the social card',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Specific social preview title',
    description: 'A concise reason to open this page.',
    images: ['/images/social-card.jpg'],
  },
};
```

Set `metadataBase` in the root layout so relative canonical and image paths resolve to the production origin. Metadata exports must remain in Server Components; move interactive code into a client child component.

### Dynamic Next.js Page Example

For a product, article, or profile route:

```tsx
import type { Metadata } from 'next';

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);

  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/products/${slug}` },
    openGraph: {
      title: page.socialTitle ?? page.title,
      description: page.socialDescription ?? page.description,
      type: 'website',
      url: `/products/${slug}`,
      images: [{
        url: page.socialImage,
        width: 1200,
        height: 630,
        alt: page.socialImageAlt,
      }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [page.socialImage],
    },
  };
}
```

Handle missing records explicitly and avoid returning generic metadata for every slug.

## WordPress Template

The safest approach is to configure one SEO plugin as the metadata owner. Set a page-specific social title, description, and image in that plugin and disable duplicate output from the theme or another plugin.

For a custom theme implementation, escape every dynamic value:

```php
<?php
$social_title = esc_attr(get_the_title());
$social_url = esc_url(get_permalink());
$social_image = esc_url(get_the_post_thumbnail_url(get_the_ID(), 'full'));
$social_description = esc_attr(wp_strip_all_tags(get_the_excerpt()));
?>
<meta property="og:title" content="<?php echo $social_title; ?>" />
<meta property="og:description" content="<?php echo $social_description; ?>" />
<meta property="og:image" content="<?php echo $social_image; ?>" />
<meta property="og:url" content="<?php echo $social_url; ?>" />
<meta property="og:type" content="article" />
<meta name="twitter:card" content="summary_large_image" />
```

Test several post types and archives. A template that works on a single article can still emit empty images for pages or custom content types.

## Article Open Graph Template

Use `article` for editorial content and add publishing context:

```html
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2026-08-03T09:00:00+02:00" />
<meta property="article:modified_time" content="2026-08-03T12:00:00+02:00" />
<meta property="article:author" content="https://example.com/authors/name" />
<meta property="article:section" content="Technical SEO" />
<meta property="article:tag" content="Open Graph" />
```

Dates should be valid ISO 8601 values and should reflect the content users see.

## Product Page Template

The core website properties still matter on product pages:

```html
<meta property="og:title" content="Product name and primary benefit" />
<meta property="og:description" content="The most useful differentiator for this product." />
<meta property="og:image" content="https://example.com/products/product-social-card.jpg" />
<meta property="og:url" content="https://example.com/products/product-name" />
<meta property="og:type" content="website" />
```

If you add product-specific properties, validate them against the consumer that needs them. Open Graph metadata does not replace search-engine Product structured data.

## Social Image Template

Use a stable 1200×630 source and describe the real file:

```html
<meta property="og:image" content="https://example.com/social/page-v2.jpg" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="Product interface displaying the reporting workflow" />
```

If the image is missing from a preview, follow the **[og:image debugging guide](/blog/open-graph-image-not-showing)**. For layout choices, see **[Open Graph image sizes and safe areas](/blog/open-graph-image-size)**.

## Common Template Mistakes

### Relative or unstable URLs

Use absolute HTTPS values in raw HTML. Avoid signed asset URLs that expire and campaign URLs that redirect through several hosts.

### Duplicate tags

Choose one metadata owner. Inspect source for duplicates after installing a plugin or introducing a shared layout.

### Client-only metadata

Ensure crawlers receive tags in the initial HTML. A browser inspector can show JavaScript changes that were absent from the original response.

### Inconsistent page identity

The requested URL, final URL, canonical, and `og:url` should agree. The visible content, title, description, and image should accurately represent the destination.

### Treating a cache problem as a code problem

Verify the live response first. Once it is correct, use the official Facebook or LinkedIn debugger when you need that platform to request a new scrape.

## Validate the Implementation

1. Deploy the page to a public HTTPS URL.
2. Run it through the **[Open Graph Checker](/open-graph-checker)**.
3. Review the rendered platform previews.
4. Fix warnings and failures using the copyable snippets.
5. Inspect the redirect trace and raw tags.
6. Open the share image privately and confirm its response.
7. Save or share the report with your team.
8. Re-run the URL after changes and review local metadata history.
9. Refresh individual platform caches only after the live response passes.

For a known-good baseline, open the **[complete Open Graph passing report](/examples/complete-open-graph-tags)**. If you want an automated code handoff, run your URL and choose **Copy for AI agent**.
