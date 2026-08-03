import { analyzeMetadata } from '@/lib/metadata-analysis';
import type { ApiResponse } from '@/types';

export interface ExampleReport {
  slug: string;
  title: string;
  description: string;
  intent: string;
  explanation: string;
  report: ApiResponse;
}

const sharedImage = 'https://www.linkglimpse.com/images/icon/social-preview-1200x630.jpeg';

function withDiagnostics(report: ApiResponse): ApiResponse {
  return { ...report, diagnostics: analyzeMetadata(report) };
}

export const exampleReports: ExampleReport[] = [
  {
    slug: 'complete-open-graph-tags',
    title: 'Complete Open Graph Tags: Passing Report Example',
    description: 'See a complete Open Graph and Twitter Card implementation with a 200 response, canonical URL, public image, and platform-ready tags.',
    intent: 'Reference implementation',
    explanation: 'Use this passing report as a baseline. It includes explicit Open Graph values, Twitter Card values, a self-referencing canonical, and a publicly fetchable HTTPS image.',
    report: withDiagnostics({
      url: 'https://example.com/complete-open-graph-page',
      requestedUrl: 'https://example.com/complete-open-graph-page',
      finalUrl: 'https://example.com/complete-open-graph-page',
      status: 200,
      statusText: 'OK',
      redirected: false,
      redirectChain: [{ url: 'https://example.com/complete-open-graph-page', status: 200, statusText: 'OK' }],
      contentType: 'text/html; charset=utf-8',
      title: 'Complete Open Graph Example',
      description: 'A reference page containing complete metadata for reliable social link previews.',
      image: sharedImage,
      canonical: 'https://example.com/complete-open-graph-page',
      robots: 'index, follow',
      siteName: 'Example Site',
      tags: {
        'og:title': 'Complete Open Graph Example',
        'og:description': 'A reference page containing complete metadata for reliable social link previews.',
        'og:image': sharedImage,
        'og:url': 'https://example.com/complete-open-graph-page',
        'og:type': 'website',
        'og:site_name': 'Example Site',
        'twitter:card': 'summary_large_image',
        'twitter:title': 'Complete Open Graph Example',
        'twitter:description': 'A reference page containing complete metadata for reliable social link previews.',
        'twitter:image': sharedImage,
        robots: 'index, follow',
      },
      imageInfo: { url: sharedImage, status: 200, contentType: 'image/jpeg', contentLength: 148000, width: 1200, height: 630 },
    }),
  },
  {
    slug: 'missing-open-graph-image',
    title: 'Missing Open Graph Image: Failed Report Example',
    description: 'See how a missing og:image appears in a diagnostic report, why platforms may show a text-only card, and which tag fixes it.',
    intent: 'Common failure',
    explanation: 'This report has valid text metadata but no social image. Copy the suggested fix from the failed check, replace the placeholder with a public 1200×630 image, and rerun the URL.',
    report: withDiagnostics({
      url: 'https://example.com/missing-og-image',
      requestedUrl: 'https://example.com/missing-og-image',
      finalUrl: 'https://example.com/missing-og-image',
      status: 200,
      statusText: 'OK',
      redirected: false,
      redirectChain: [{ url: 'https://example.com/missing-og-image', status: 200, statusText: 'OK' }],
      contentType: 'text/html; charset=utf-8',
      title: 'Page With a Missing Open Graph Image',
      description: 'The title and description work, but the social share image is missing.',
      canonical: 'https://example.com/missing-og-image',
      robots: 'index, follow',
      tags: {
        'og:title': 'Page With a Missing Open Graph Image',
        'og:description': 'The title and description work, but the social share image is missing.',
        'og:url': 'https://example.com/missing-og-image',
        'twitter:card': 'summary_large_image',
        robots: 'index, follow',
      },
    }),
  },
  {
    slug: 'redirected-social-share-url',
    title: 'Redirected Social Share URL: Diagnostic Example',
    description: 'Understand how redirect hops affect Open Graph crawling and why shared URLs should point directly to the final canonical destination.',
    intent: 'Redirect debugging',
    explanation: 'Redirects are not automatically broken, but every hop adds crawler work and another place for caches to disagree. Prefer sharing the final HTTPS canonical URL directly.',
    report: withDiagnostics({
      url: 'https://www.example.com/campaign',
      requestedUrl: 'http://example.com/go',
      finalUrl: 'https://www.example.com/campaign',
      status: 200,
      statusText: 'OK',
      redirected: true,
      redirectChain: [
        { url: 'http://example.com/go', status: 301, statusText: 'Moved Permanently', location: 'https://example.com/go' },
        { url: 'https://example.com/go', status: 302, statusText: 'Found', location: 'https://www.example.com/campaign' },
        { url: 'https://www.example.com/campaign', status: 200, statusText: 'OK' },
      ],
      contentType: 'text/html; charset=utf-8',
      title: 'Campaign Landing Page',
      description: 'A campaign page reached after two redirects.',
      image: sharedImage,
      canonical: 'https://www.example.com/campaign',
      robots: 'index, follow',
      tags: {
        'og:title': 'Campaign Landing Page',
        'og:description': 'A campaign page reached after two redirects.',
        'og:image': sharedImage,
        'og:url': 'https://www.example.com/campaign',
        'twitter:card': 'summary_large_image',
        robots: 'index, follow',
      },
      imageInfo: { url: sharedImage, status: 200, contentType: 'image/jpeg', contentLength: 148000, width: 1200, height: 630 },
    }),
  },
];

export function getExampleReport(slug: string): ExampleReport | undefined {
  return exampleReports.find((example) => example.slug === slug);
}
