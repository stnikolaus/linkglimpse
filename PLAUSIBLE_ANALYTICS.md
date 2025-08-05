# Plausible Analytics Integration

This project uses [Plausible Analytics](https://plausible.io/) for privacy-focused website analytics. The integration is set up using the official `next-plausible` package.

## Configuration

### Domain and Script Extensions

The analytics are configured for:
- **Domain**: `linkglimpse.com`
- **Extensions enabled**:
  - `trackOutboundLinks`: Tracks clicks on external links
  - `taggedEvents`: Enables custom event tracking via HTML attributes
  - `pageviewProps`: Allows custom properties on pageviews

### Proxy Setup

The configuration includes proxying to avoid ad blockers:
- Analytics requests are routed through your own domain
- This significantly reduces the chance of being blocked by ad-blocking extensions
- The proxy is configured in `next.config.ts` using `withPlausibleProxy()`

## Automatic Tracking

The following are tracked automatically:
- **Pageviews**: All page navigation and route changes
- **Outbound links**: Clicks on external links (due to `trackOutboundLinks: true`)
- **File downloads**: Downloads of files like PDFs, docs, etc.

## Custom Event Tracking

### Using the Custom Hook

Import and use the `useLinkGlimpseAnalytics` hook for consistent event tracking:

```tsx
'use client';

import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';

export function YourComponent() {
  const analytics = useLinkGlimpseAnalytics();

  const handlePreviewGeneration = (platform: string, url: string) => {
    analytics.trackPreviewGeneration(platform, url);
    // Your existing logic here
  };

  return (
    <button onClick={() => handlePreviewGeneration('facebook', 'https://example.com')}>
      Generate Facebook Preview
    </button>
  );
}
```

### Available Tracking Methods

- `trackPreviewGeneration(platform, url)` - Track social media preview generation
- `trackPlatformNavigation(platform)` - Track navigation to different platforms
- `trackContentShare(action, platform?)` - Track content sharing/copying
- `trackBulkPreview(count)` - Track bulk preview usage
- `trackButtonClick(buttonName, location)` - Track general button interactions

### Direct Plausible Usage

For custom events not covered by the hook:

```tsx
'use client';

import { usePlausible } from 'next-plausible';

export function CustomComponent() {
  const plausible = usePlausible();

  const handleCustomEvent = () => {
    plausible('Custom Event Name', {
      props: {
        custom_property: 'value',
        another_prop: 'another_value',
      },
    });
  };

  return <button onClick={handleCustomEvent}>Track Custom Event</button>;
}
```

### HTML Attribute Tracking

Since `taggedEvents` is enabled, you can also track events using HTML attributes:

```html
<button class="plausible-event-name=Button+Click plausible-event-location=Header">
  Click me
</button>
```

## Event Properties

When sending custom events, use descriptive property names:
- Use snake_case for consistency: `button_name`, `url_domain`, `platform`
- Keep property values short and meaningful
- Avoid sending sensitive information like full URLs (use domains instead)

## Development vs Production

- **Development**: Analytics are disabled by default in development mode
- **Production**: Analytics are automatically enabled when deployed
- **Testing**: You can enable localhost tracking by adding `trackLocalhost={true}` to the PlausibleProvider

## Privacy Compliance

Plausible Analytics is privacy-focused by design:
- No cookies are used
- No personal data is collected
- GDPR, CCPA, and PECR compliant
- Lightweight script (~1KB)
- Data is processed in the EU

## Viewing Analytics

1. Log in to your Plausible account at [plausible.io](https://plausible.io)
2. Select the `linkglimpse.com` website
3. View real-time and historical analytics data
4. Set up goals for custom events in the Plausible dashboard

## Troubleshooting

### Events Not Showing Up
- Ensure the component using `usePlausible` is a client component (`'use client'`)
- Check that the PlausibleProvider is properly configured in the layout
- Verify the domain name matches exactly: `linkglimpse.com`

### Ad Blockers
- The proxy configuration should handle most ad blockers
- If testing locally, try disabling your ad blocker temporarily
- Check the Network tab in browser dev tools for blocked requests

### Custom Events Not Tracked
- Make sure to set up Goals in your Plausible dashboard for custom events
- Event names are case-sensitive
- Allow some time for events to appear in the dashboard (usually immediate, but can take a few minutes)