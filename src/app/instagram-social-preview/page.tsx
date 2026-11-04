'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Instagram } from 'lucide-react';
import { InstagramPreview } from '@/components/social-previews';
import { ApiResponse } from '@/types';
import { fetchUrlMetadata } from '@/lib/url-utils';
import UrlInput from '@/components/UrlInput';
import DiagnosticsPanel from '@/components/DiagnosticsPanel';
import FAQStructuredData from '@/components/FAQStructuredData';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';

const faqItems = [
  {
    question: 'Does this show the exact Instagram interface?',
    answer: 'No. LinkGlimpse maps public page metadata into a representative Instagram photo-post composition. Instagram can change its interface, cropping, and publishing behavior independently.',
  },
  {
    question: 'Is this an Instagram link-card validator?',
    answer: 'No. The tool does not connect to Instagram or test a live feed, Story, bio, or direct-message card. It reviews the public page metadata and image that can be reused in social content.',
  },
  {
    question: 'What does the Instagram post preview inspect?',
    answer: 'It fetches the public URL, follows redirects, reads the title, description, image, canonical, and robots signals, checks the share image response, and turns detected problems into copy-ready fixes.',
  },
  {
    question: 'Which metadata controls this mockup?',
    answer: 'The composition uses the best public title, description, image, and final URL that LinkGlimpse can fetch. Open Graph values usually provide the strongest inputs, with page metadata used as a fallback when available.',
  },
];

export default function InstagramSocialPreview() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlMetadata, setUrlMetadata] = useState<ApiResponse | null>(null);
  const analytics = useLinkGlimpseAnalytics();

  const handleUrlSubmit = async (url: string) => {
    const startedAt = performance.now();
    setIsLoading(true);
    setError('');
    setUrlMetadata(null);
    analytics.trackPreviewStarted('instagram-post-preview', url);

    try {
      const fetchedMetadata = await fetchUrlMetadata(url);

      if (fetchedMetadata.error) {
        throw new Error(fetchedMetadata.error);
      }

      setUrlMetadata(fetchedMetadata);
      analytics.trackPreviewSucceeded('instagram-post-preview', fetchedMetadata, Math.round(performance.now() - startedAt));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate preview';
      setError(message);
      analytics.trackPreviewFailed('instagram-post-preview', url, message);
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-16">

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full">
              <Instagram className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Instagram Post Preview from URL</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Enter a public URL to preview a representative Instagram photo post using its image, title and description. Check the content before publishing.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Reviewed November 4, 2026 · Maintained by <Link href="/about" className="font-medium text-pink-700 hover:underline">LinkGlimpse</Link> ·{' '}
            <Link href="/methodology" className="font-medium text-pink-700 hover:underline">How the diagnostics work</Link>
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-pink-200 bg-pink-50 p-5 text-sm text-pink-950">
          <p className="font-semibold">Review page metadata as a representative Instagram post mockup.</p>
          <p className="mt-2 leading-6">
            LinkGlimpse fetches the public page and maps its best image, title, description, and URL into a photo-post composition. It does not connect to Instagram, publish a post, or reproduce a live feed, Story, bio, or direct-message link card.
          </p>
        </div>

        {/* URL Input */}
        <div className="mb-8">
          <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} />
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

        {/* Instagram Preview */}
        {urlMetadata && (
          <DiagnosticsPanel
            metadata={urlMetadata}
            previewTitle="Instagram post preview"
            preview={(
              <InstagramPreview
                image={urlMetadata.image}
                media={urlMetadata.image ? [{
                  url: urlMetadata.image,
                  type: 'image/jpeg',
                  alt: urlMetadata.title || 'Instagram post image'
                }] : undefined}
                name={getDomain(urlMetadata.url)}
                profileImage="https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png"
                caption={`${urlMetadata.title || 'No title'}\n\n${urlMetadata.description || 'No description'}\n\n${urlMetadata.url}`}
              />
            )}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 bg-pink-50 border border-pink-200 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600 mr-2"></div>
              <span className="text-pink-700">Generating Instagram preview...</span>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 rounded-lg border border-gray-200 bg-white p-8">
          <FAQStructuredData items={faqItems} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How the Instagram Post Preview Is Generated</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              LinkGlimpse reads the metadata returned by the public URL and uses it to build a representative photo-post composition.
              The visual is a content-review aid, not evidence of how Instagram will render or publish the page.
              See the <Link href="/methodology" className="font-medium text-pink-700 hover:underline">LinkGlimpse methodology</Link> for the fetching, fallback, and scoring model.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Metadata used for the mockup</h3>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li><code className="bg-gray-200 px-1 rounded">og:image</code> or the best public page image for the post media</li>
                <li><code className="bg-gray-200 px-1 rounded">og:title</code> and the page title for the opening caption</li>
                <li><code className="bg-gray-200 px-1 rounded">og:description</code> and the meta description for supporting copy</li>
                <li>The fetched final URL and hostname for source context</li>
              </ul>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">What the Instagram Post Preview Tests</h2>
            <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
              <li>The HTTP response, final URL, and redirect path returned by the public page</li>
              <li>Open Graph and page metadata available in the server-rendered HTML</li>
              <li>The share image response, format, byte size, and detectable dimensions</li>
              <li>Canonical and robots signals that can reveal a deployment or indexing mismatch</li>
              <li>Copy-ready fixes, a shareable report, and an AI remediation prompt for detected problems</li>
            </ul>
            <p className="text-gray-600 mt-4">
              Use the <Link href="/open-graph-checker" className="font-medium text-pink-700 hover:underline">Open Graph checker</Link> when the main job is validating a website link card rather than reviewing an Instagram-style content mockup.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-3">Instagram Post Preview Questions</h2>
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
