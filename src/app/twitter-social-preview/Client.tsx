"use client";

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Twitter } from 'lucide-react';
import { TwitterPreview } from '@/components/social-previews';
import { ApiResponse } from '@/types';
import { fetchUrlMetadata } from '@/lib/url-utils';
import UrlInput from '@/components/UrlInput';
import FAQStructuredData from '@/components/FAQStructuredData';
import DiagnosticsPanel from '@/components/DiagnosticsPanel';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';

export default function TwitterSocialPreviewClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlMetadata, setUrlMetadata] = useState<ApiResponse | null>(null);
  const analytics = useLinkGlimpseAnalytics();

  const faqItems = [
    {
      question: 'What is a Twitter Card Debugger?',
      answer: 'A Twitter Card debugger fetches a public page, checks its Twitter Card and Open Graph metadata, and renders a representative preview. It helps you find missing or unreachable metadata before you share the URL on X.'
    },
    {
      question: 'How do I refresh my Twitter Card cache?',
      answer: 'Paste your URL and click “Validate Twitter Card.” LinkGlimpse fetches the latest public page metadata so you can confirm your deployed tags. It does not clear X\'s own cache; platform cache refreshes remain controlled by X.'
    },
    {
      question: 'Which Twitter Card types are supported?',
      answer: 'LinkGlimpse checks Summary and Summary with Large Image cards. It validates twitter:card, twitter:title, twitter:description, and twitter:image values, then shows a representative card preview.'
    },
    {
      question: 'Can I debug a Twitter Card in other languages?',
      answer: 'Yes. The validator can inspect public URLs with metadata in any language. Paste the URL, run the test, and review the extracted tags and preview.'
    }
  ];

  const handleUrlSubmit = async (url: string) => {
    const startedAt = performance.now();
    setIsLoading(true);
    setError('');
    setUrlMetadata(null);
    analytics.trackPreviewStarted('twitter-card-validator', url);

    try {
      const fetchedMetadata = await fetchUrlMetadata(url);
      if (fetchedMetadata.error) {
        throw new Error(fetchedMetadata.error);
      }
      setUrlMetadata(fetchedMetadata);
      analytics.trackPreviewSucceeded('twitter-card-validator', fetchedMetadata, Math.round(performance.now() - startedAt));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate preview';
      setError(message);
      analytics.trackPreviewFailed('twitter-card-validator', url, message);
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
            <div className="bg-blue-400 p-3 rounded-full">
              <Twitter className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Twitter Card Validator &amp; X Preview</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Validate Twitter Card and Open Graph tags for any URL. Preview the card on X and find missing title, description, image or card-type metadata.
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Reviewed September 21, 2026 · Maintained by LinkGlimpse · <Link href="/methodology" className="font-medium text-blue-700 hover:underline">How the diagnostics work</Link>
          </p>
        </div>

        <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-5 text-sm text-blue-950">
          <p className="font-semibold">Looking for the former Twitter Card Validator workflow?</p>
          <p className="mt-2 leading-6">
            Paste the public URL below. LinkGlimpse follows redirects, reads the deployed HTML, checks card tags and image reachability, and shows the metadata a crawler can retrieve now. The preview is representative: LinkGlimpse is independent of X, cannot reproduce X&apos;s private renderer, and cannot force X to refresh its cache.
          </p>
        </div>

        <div className="mb-8">
          <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} ctaLabel="Validate Twitter Card" placeholder="Paste a URL to test your Twitter Card" />
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
            previewTitle="Twitter Card preview"
            preview={(
              <TwitterPreview
                tweets={[{
                  date: new Date(),
                  name: getDomain(urlMetadata.url),
                  profileImage: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png',
                  screenName: `@${getDomain(urlMetadata.url).replace(/\./g, '')}`,
                  text: `${urlMetadata.title || 'No title'}\n\n${urlMetadata.description || 'No description'}\n\n${urlMetadata.url}`
                }]}
              />
            )}
          />
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-700">Generating Twitter preview...</span>
            </div>
          </div>
        )}

        <div className="mt-12 rounded-lg border border-gray-200 bg-white p-8">
          <FAQStructuredData items={faqItems} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Test a Twitter Card</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Use this Twitter Card debugger to test any public page. The validator checks essential tags including <code className="bg-gray-200 px-1 rounded">twitter:card</code>, <code className="bg-gray-200 px-1 rounded">twitter:title</code>, <code className="bg-gray-200 px-1 rounded">twitter:description</code>, and <code className="bg-gray-200 px-1 rounded">twitter:image</code>, then renders a representative preview.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">What the Result Checks</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>HTTP response, final URL, and every detected redirect hop</li>
              <li>Twitter Card and Open Graph tag coverage, including fallback values</li>
              <li>Canonical, robots, and share-image reachability signals</li>
              <li>Platform-readiness checks with copy-ready fixes for failed or incomplete metadata</li>
              <li>A representative X preview, raw extracted tags, a shareable result link, and an AI remediation prompt</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Verify Live Twitter Card Tags</h3>
            <p className="text-gray-600 mb-4">
              After updating your site, re-run the test to confirm the public page now exposes the new image, title, and description. LinkGlimpse does not clear or control X&apos;s platform cache.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-2">How to Debug a Twitter Card</h3>
            <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-2">
              <li>Paste your public URL and click “Validate Twitter Card.”</li>
              <li>Inspect the HTTP response, redirect trace, extracted tags, diagnostics, and card preview.</li>
              <li>Copy a suggested fix or AI prompt for any failed or incomplete check.</li>
              <li>Update the tags in your HTML template or CMS, deploy the change, and run the validator again.</li>
              <li>Confirm the deployed HTML is correct before sharing. X may still use a cached rendering.</li>
            </ol>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Twitter Card Best Practices</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Use <em>summary_large_image</em> for posts where the image should dominate the preview</li>
              <li>Use a high-resolution image with an aspect ratio suited to the selected card type</li>
              <li>Keep titles specific and descriptions useful when read outside the page</li>
              <li>Use absolute HTTPS URLs for assets and make sure crawlers can retrieve them</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Fix Common Twitter Card Problems</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Outdated preview? Confirm the deployed HTML changed first. A new image URL can distinguish a deployment problem from a stale platform cache, but it cannot force X to refetch the page</li>
              <li>Broken image? Verify the URL is reachable and returns 200 status</li>
              <li>No card? Confirm <code className="bg-gray-200 px-1 rounded">twitter:card</code> is set and meta tags are in the <code className="bg-gray-200 px-1 rounded">&lt;head&gt;</code></li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Why Validate a Twitter Card?</h3>
            <p className="text-gray-600 mb-4">
              A validator finds metadata defects before sharing and helps keep titles, descriptions, and images consistent. It cannot guarantee X&apos;s final rendering, cache-refresh timing, or engagement.
            </p>
            <p className="text-gray-600 mb-4">
              For a deeper repair workflow, read <Link href="/blog/twitter-card-preview-not-showing" className="font-medium text-blue-700 hover:underline">why a Twitter Card preview may not appear</Link>. For tags shared across more platforms, use the <Link href="/blog/open-graph-tags-guide" className="font-medium text-blue-700 hover:underline">Open Graph tags guide</Link>.
            </p>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Supported Twitter Card Types</h2>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Summary Card</li>
              <li>Summary Card with Large Image</li>
            </ul>
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Twitter Card Validator Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Twitter Card Optimization Examples</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2"><strong>Before:</strong> Cropped image, long title, generic description.</p>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Title: “All About Our New Release With Many Features And Improvements”</li>
                <li>Description: “Read our latest post about updates.”</li>
                <li>Image: Mismatched aspect ratio and a text-heavy thumbnail</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2"><strong>After:</strong> Suitable image ratio, concise headline, clear value.</p>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Title: “New Release: 3 Features for Faster Reporting”</li>
                <li>Description: “Upgrade today and get simpler dashboards, faster exports, and better insights.”</li>
                <li>Image: Large-card ratio, minimal text, strong contrast</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Twitter Card QA Checklist</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Validate the card type and all required tags</li>
              <li>Confirm the image is reachable, uses HTTPS, and is not blocked from crawlers</li>
              <li>Re-run after deployment to confirm the public HTML changed</li>
              <li>Review the image at narrow and wide widths to catch unexpected cropping</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
