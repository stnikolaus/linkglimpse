'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Hash } from 'lucide-react';
import { BlueskyPreview } from '@/components/social-previews';
import { ApiResponse } from '@/types';
import { fetchUrlMetadata } from '@/lib/url-utils';
import UrlInput from '@/components/UrlInput';
import DiagnosticsPanel from '@/components/DiagnosticsPanel';
import FAQStructuredData from '@/components/FAQStructuredData';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';

const faqItems = [
  {
    question: 'How does Bluesky create a link preview?',
    answer: 'Bluesky website cards include a URL, title, description, and thumbnail. The official Bluesky example reads og:title, og:description, and og:image from the linked page before creating the card.',
  },
  {
    question: 'Does this tool show the exact Bluesky card?',
    answer: 'No. LinkGlimpse shows a representative preview from the public metadata it can fetch. Bluesky clients can apply their own rendering, cropping, caching, and moderation behavior.',
  },
  {
    question: 'Why is my Bluesky link preview missing or outdated?',
    answer: 'The public page may have missing or unreachable Open Graph tags, a blocked image, a redirect problem, or metadata that changed after a client cached the link. Validate the deployed page first, then share the final public URL.',
  },
  {
    question: 'Which tags should I check for a Bluesky card?',
    answer: 'Start with one non-empty og:title, og:description, and absolute HTTPS og:image. Also verify the page response, final URL, canonical, robots directives, and image response.',
  },
];

export default function BlueskySocialPreview() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlMetadata, setUrlMetadata] = useState<ApiResponse | null>(null);
  const analytics = useLinkGlimpseAnalytics();

  const handleUrlSubmit = async (url: string) => {
    const startedAt = performance.now();
    setIsLoading(true);
    setError('');
    setUrlMetadata(null);
    analytics.trackPreviewStarted('bluesky-link-preview', url);

    try {
      const fetchedMetadata = await fetchUrlMetadata(url);

      if (fetchedMetadata.error) {
        throw new Error(fetchedMetadata.error);
      }

      setUrlMetadata(fetchedMetadata);
      analytics.trackPreviewSucceeded('bluesky-link-preview', fetchedMetadata, Math.round(performance.now() - startedAt));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate preview';
      setError(message);
      analytics.trackPreviewFailed('bluesky-link-preview', url, message);
    } finally {
      setIsLoading(false);
    }
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname;
    } catch {
      return url;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 pt-16">

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <Hash className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bluesky Link Preview Checker</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preview how a public URL may appear in a Bluesky post. Check the representative link card, title, description and image before sharing.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Reviewed October 7, 2026 · Maintained by <Link href="/about" className="font-medium text-blue-700 hover:underline">LinkGlimpse</Link> ·{' '}
            <Link href="/methodology" className="font-medium text-blue-700 hover:underline">How the diagnostics work</Link>
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-5 text-sm text-blue-950">
          <p className="font-semibold">Check the public metadata behind a Bluesky website card.</p>
          <p className="mt-2 leading-6">
            Paste the final public URL below. LinkGlimpse follows redirects, reads the server-rendered metadata, checks the share image, and shows a representative card. It cannot reproduce every Bluesky client, clear a client cache, or guarantee the final crop.
          </p>
        </div>

        {/* URL Input */}
        <div className="mb-8">
          <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} ctaLabel="Check Bluesky Preview" placeholder="Paste a URL to preview on Bluesky" />
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Bluesky Preview */}
        {urlMetadata && (
          <DiagnosticsPanel
            metadata={urlMetadata}
            previewTitle="Bluesky link preview"
            preview={(
              <BlueskyPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                url={urlMetadata.url}
                image={urlMetadata.image}
                user={{
                  displayName: getDomain(urlMetadata.url),
                  avatarUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png',
                  address: `@${getDomain(urlMetadata.url).replace(/\./g, '')}.bsky.social`
                }}
              />
            )}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              <span className="text-blue-700">Generating Bluesky preview...</span>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 rounded-lg border border-gray-200 bg-white p-8">
          <FAQStructuredData items={faqItems} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How Bluesky Link Previews Use Metadata</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              A Bluesky website card carries a URL, title, description, and thumbnail.
              The <a href="https://github.com/bluesky-social/bsky-docs/blob/main/docs/advanced-guides/posts.md" target="_blank" rel="noreferrer" className="font-medium text-blue-700 hover:underline">official Bluesky posting guide</a> demonstrates creating those fields from <code className="bg-gray-200 px-1 rounded">og:title</code>, <code className="bg-gray-200 px-1 rounded">og:description</code>, and <code className="bg-gray-200 px-1 rounded">og:image</code>.
              LinkGlimpse inspects those public signals without posting to Bluesky.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Key metadata to check</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li><code className="bg-gray-200 px-1 rounded">og:title</code> - The title of your content</li>
                <li><code className="bg-gray-200 px-1 rounded">og:description</code> - A brief description</li>
                <li><code className="bg-gray-200 px-1 rounded">og:image</code> - The image to display</li>
                <li><code className="bg-gray-200 px-1 rounded">og:url</code> and the canonical - Signals for the intended page URL</li>
              </ul>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">What the Bluesky Preview Checker Tests</h2>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>The HTTP response, final URL, and redirect path returned by the public page</li>
              <li>Open Graph and Twitter Card values available in the server-rendered HTML</li>
              <li>The share image response, format, byte size, and detectable dimensions</li>
              <li>Canonical and robots signals that can reveal a deployment or indexing mismatch</li>
              <li>Copy-ready fixes, a shareable report, and an AI remediation prompt for detected problems</li>
            </ul>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">How to Fix a Missing Bluesky Link Preview</h2>
            <ol className="text-sm text-gray-600 space-y-2 list-decimal pl-5">
              <li>Paste the final public URL and run the checker.</li>
              <li>Confirm the page returns a successful HTML response and the expected final URL.</li>
              <li>Add one non-empty title, description, and absolute HTTPS image value where a diagnostic is missing.</li>
              <li>Make sure the image is public, returns an image content type, and does not require cookies or authentication.</li>
              <li>Deploy the fix and rerun the same URL before sharing it again.</li>
            </ol>
            <p className="text-gray-600 mt-4">
              If the live metadata is correct but an existing post still looks stale, the remaining difference may be client-side caching or rendering that LinkGlimpse cannot control.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Bluesky Link Preview Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <article key={item.question} className="rounded-lg bg-gray-50 p-5">
                  <h3 className="font-semibold text-gray-900">{item.question}</h3>
                  <p className="mt-2 text-gray-600">{item.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
