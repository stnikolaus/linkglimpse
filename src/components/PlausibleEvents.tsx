'use client';

import { usePlausible } from 'next-plausible';

/**
 * Custom hook for tracking common events in LinkGlimpse
 * This provides a consistent way to track user interactions across the app
 */
export function useLinkGlimpseAnalytics() {
  const plausible = usePlausible();

  return {
    // Track when a user generates a social media preview
    trackPreviewGeneration: (platform: string, url: string) => {
      plausible('Preview Generated', {
        props: {
          platform,
          url_domain: new URL(url).hostname,
        },
      });
    },

    // Track when a user clicks on a social media platform in the navigation
    trackPlatformNavigation: (platform: string) => {
      plausible('Platform Navigation', {
        props: {
          platform,
        },
      });
    },

    // Track when a user copies a URL or shares content
    trackContentShare: (action: 'copy' | 'share', platform?: string) => {
      plausible('Content Share', {
        props: {
          action,
          platform: platform || 'unknown',
        },
      });
    },

    // Track when a user uses the bulk preview feature
    trackBulkPreview: (count: number) => {
      plausible('Bulk Preview Used', {
        props: {
          url_count: count.toString(),
        },
      });
    },

    // Track general button clicks with custom properties
    trackButtonClick: (buttonName: string, location: string) => {
      plausible('Button Click', {
        props: {
          button_name: buttonName,
          location,
        },
      });
    },
  };
}

/**
 * Example component showing how to use Plausible events
 * You can use this pattern in your existing components
 */
export function ExampleAnalyticsComponent() {
  const analytics = useLinkGlimpseAnalytics();

  const handlePreviewClick = () => {
    analytics.trackPreviewGeneration('facebook', 'https://example.com');
  };

  const handleNavigationClick = () => {
    analytics.trackPlatformNavigation('twitter');
  };

  return (
    <div className="space-x-4">
      <button 
        onClick={handlePreviewClick}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate Preview (Tracked)
      </button>
      <button 
        onClick={handleNavigationClick}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Navigate to Platform (Tracked)
      </button>
    </div>
  );
}