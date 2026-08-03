"use client";

import { useState } from 'react';
import { AlertCircle, Facebook } from 'lucide-react';
import { FacebookPreview } from '@/components/social-previews';
import { ApiResponse } from '@/types';
import { fetchUrlMetadata } from '@/lib/url-utils';
import UrlInput from '@/components/UrlInput';
import FAQStructuredData from '@/components/FAQStructuredData';
import DiagnosticsPanel from '@/components/DiagnosticsPanel';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';

export default function FacebookSocialPreviewClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlMetadata, setUrlMetadata] = useState<ApiResponse | null>(null);
  const analytics = useLinkGlimpseAnalytics();

  const faqItems = [
    {
      question: 'What is the Facebook Debugger?',
      answer: 'The Facebook Debugger (also known as a meta debugger, facebook url debugger, or facebook open graph debugger) is a tool that reads your page\'s Open Graph tags and shows how a link will appear on Facebook. It helps you identify missing or invalid tags so you can fix previews before sharing.'
    },
    {
      question: 'How to debug a Facebook link?',
      answer: 'Paste your URL into the input above and click the button to fetch the latest Open Graph data. Our facebook og debugger (facebook linter / facebook url linter) extracts og:title, og:description, og:image, and og:url to render an instant preview. Update your tags on your site and re-run to confirm changes.'
    },
    {
      question: 'Which Open Graph tags does Facebook use?',
      answer: 'Key tags include og:title, og:description, og:image, and og:url. Optional tags like og:site_name and og:type can also influence how your preview appears.'
    },
    {
      question: 'Why do images not update on Facebook?',
      answer: 'Facebook caches previews. After you change og:image, generate a new preview here to verify the tag, then share again. Ensure the image is accessible, at least 1200×630, and served over HTTPS.'
    }
  ];

  const handleUrlSubmit = async (url: string) => {
    const startedAt = performance.now();
    setIsLoading(true);
    setError('');
    setUrlMetadata(null);
    analytics.trackPreviewStarted('facebook-debugger', url);

    try {
      const fetchedMetadata = await fetchUrlMetadata(url);
      if (fetchedMetadata.error) {
        throw new Error(fetchedMetadata.error);
      }
      setUrlMetadata(fetchedMetadata);
      analytics.trackPreviewSucceeded('facebook-debugger', fetchedMetadata, Math.round(performance.now() - startedAt));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate preview';
      setError(message);
      analytics.trackPreviewFailed('facebook-debugger', url, message);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Facebook className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Facebook Debugger Alternative &amp; OG Preview</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Check live Open Graph tags and preview a Facebook link card without signing in. Find missing titles, descriptions and images before sharing.
          </p>
        </div>

        <div className="mb-8">
          <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} ctaLabel="Debug Facebook Link" placeholder="Paste a URL to debug Facebook preview" />
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {urlMetadata && (
          <DiagnosticsPanel
            metadata={urlMetadata}
            previewTitle="Facebook link preview"
            preview={(
              <FacebookPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                url={urlMetadata.url}
                image={urlMetadata.image}
                user={{ displayName: getDomain(urlMetadata.url) }}
              />
            )}
          />
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-700">Generating Facebook preview...</span>
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <FAQStructuredData items={faqItems} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How This Facebook Open Graph Debugger Works</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              This Facebook Open Graph debugger fetches the public page, extracts its metadata, and renders a representative card alongside the exact tags and technical checks it found.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Test Facebook Open Graph Tags</h3>
            <p className="text-gray-600 mb-4">
              Validate <code className="bg-gray-200 px-1 rounded">og:title</code>, <code className="bg-gray-200 px-1 rounded">og:description</code>, <code className="bg-gray-200 px-1 rounded">og:image</code>, and <code className="bg-gray-200 px-1 rounded">og:url</code> with one click. Our facebook og debugger highlights missing fields and sizing issues that can reduce clicks.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Why Use a Facebook Link Debugger?</h3>
            <p className="text-gray-600 mb-4">
              Correct previews drive engagement. Whether you search “debug facebook,” “debugger facebook,” or “facebook debug link,” this facebook opengraph tester ensures your brand looks right on every share.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Key Facebook Meta Tags</h4>
              <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
                <li><code className="bg-gray-200 px-1 rounded">og:title</code> - The title of your content</li>
                <li><code className="bg-gray-200 px-1 rounded">og:description</code> - A compelling description</li>
                <li><code className="bg-gray-200 px-1 rounded">og:image</code> - A high-quality image (1200×630 recommended)</li>
                <li><code className="bg-gray-200 px-1 rounded">og:url</code> - The canonical URL</li>
                <li><code className="bg-gray-200 px-1 rounded">og:site_name</code> - Your site or brand name</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">How to Debug a Facebook Link</h3>
            <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-2">
              <li>Paste your URL into the facebook url debugger and click “Debug Facebook Link.”</li>
              <li>Review the preview and the extracted tags. Check for missing or incorrect values.</li>
              <li>Update your HTML to correct Open Graph tags or image dimensions.</li>
              <li>Wait for your site to deploy, then re-run the facebook open graph debugger to verify changes.</li>
              <li>Share your link with confidence once the preview matches your expectations.</li>
            </ol>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Facebook OG Image Requirements</h3>
            <p className="text-gray-600 mb-4">
              For best results, use 1200×630 images in JPG or PNG, under 5 MB, with strong contrast and clear subject matter. Keep crucial elements within a safe area so that cropping on mobile doesn’t hide key content. Avoid text-heavy images when possible; if text is needed, ensure it’s legible at small sizes.
            </p>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Serve images over HTTPS with a stable URL that won’t change.</li>
              <li>Provide absolute URLs for <code className="bg-gray-200 px-1 rounded">og:image</code>.</li>
              <li>Use descriptive file names and alt text in your CMS when available.</li>
              <li>Host images on a fast CDN to minimize load time during scraping.</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Facebook Preview Errors This Tool Finds</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Missing <code className="bg-gray-200 px-1 rounded">og:title</code> or <code className="bg-gray-200 px-1 rounded">og:description</code></li>
              <li>Invalid or unreachable <code className="bg-gray-200 px-1 rounded">og:image</code> URL</li>
              <li>Non-HTTPS resources causing mixed content issues</li>
              <li>Overly long titles or descriptions that truncate awkwardly</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Facebook Open Graph QA Checklist</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>One set of Open Graph tags per page (avoid duplicates)</li>
              <li>Canonical <code className="bg-gray-200 px-1 rounded">og:url</code> that matches the final destination</li>
              <li>Consistent <code className="bg-gray-200 px-1 rounded">og:site_name</code> across your domain</li>
              <li>Server returns 200 status for the URL and image assets</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Official Facebook Debugger vs. LinkGlimpse</h3>
            <p className="text-gray-600 mb-4">
              The official tool is great for cache refreshes, but this facebook url linter focuses on clarity and speed. It provides a clean facebook link debug preview and a guided checklist, making it ideal for quick QA before campaigns.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-10 mb-4">Facebook Debugger Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Before-and-After Preview Examples</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2"><strong>Before:</strong> Generic image, long title, vague description.</p>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Title: “Our Product Is Great And You Should Try It Today Because It Has Many Features”</li>
                <li>Description: “We offer various solutions for businesses of all sizes.”</li>
                <li>Image: Low-contrast, text-heavy graphic</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2"><strong>After:</strong> Clear image, concise title, outcome-driven description.</p>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Title: “Cut Reporting Time By 60% With Automated Dashboards”</li>
                <li>Description: “Plug-and-play analytics for fast-moving teams. Try free—set up in minutes.”</li>
                <li>Image: High-contrast photo with simple overlay and brand colors</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Accessible Facebook Link Previews</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Ensure images meet accessibility guidelines for contrast and clarity</li>
              <li>Avoid misleading thumbnails; align preview with on-page content</li>
              <li>Respect privacy and licensing for imagery and brand assets</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-900 mt-8 mb-2">Facebook Campaign Preview Checklist</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>Preview the URL with this facebook url debugger and confirm all fields</li>
              <li>Validate mobile vs desktop cropping by testing multiple images</li>
              <li>Share a private test post to verify the real feed rendering</li>
              <li>Monitor analytics to correlate improved previews with CTR changes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
