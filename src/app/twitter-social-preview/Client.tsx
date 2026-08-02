"use client";

import { useState } from 'react';
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
      answer: 'A Twitter Card Debugger (debugger twitter) is a tool that lets you preview and validate how a URL renders as a Twitter Card. It helps you test meta tags, detect issues, and see a live preview before sharing. With our twitter sharing debugger you can run a twitter cards test instantly and fix problems that could reduce visibility.'
    },
    {
      question: 'How do I refresh my Twitter Card cache?',
      answer: 'Paste your URL and click “Validate Twitter Card.” LinkGlimpse fetches the latest public page metadata so you can confirm your deployed tags. It does not clear X\'s own cache; platform cache refreshes remain controlled by X.'
    },
    {
      question: 'Which Twitter Card types are supported?',
      answer: 'We support Summary and Summary with Large Image. The tool validates twitter:title, twitter:description, twitter:image, and twitter:card values, and shows an instant preview of the tweet and card.'
    },
    {
      question: 'Can I debug a Twitter Card in other languages?',
      answer: 'Yes. Our interface supports all URLs globally. If you search “depurar url twitter,” this is the same workflow—paste the URL, run the twitter cards test, and verify the live preview.'
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
      <div className="max-w-4xl mx-auto px-4 py-8">
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
          <div className="space-y-8">
            <DiagnosticsPanel metadata={urlMetadata} />
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Twitter className="h-6 w-6 text-blue-400 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Twitter Card Preview Result</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <TwitterPreview
                  tweets={[{
                    date: new Date(),
                    name: getDomain(urlMetadata.url),
                    profileImage: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png',
                    screenName: `@${getDomain(urlMetadata.url).replace(/\./g, '')}`,
                    text: `${urlMetadata.title || 'No title'}\n\n${urlMetadata.description || 'No description'}\n\n${urlMetadata.url}`
                  }]}
                />
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Twitter Card Metadata</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Title:</span>
                    <p className="text-gray-600 mt-1">{urlMetadata.title || 'Not found'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Description:</span>
                    <p className="text-gray-600 mt-1">{urlMetadata.description || 'Not found'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">URL:</span>
                    <p className="text-gray-600 mt-1 break-all">{urlMetadata.url}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Image:</span>
                    <p className="text-gray-600 mt-1 break-all">{urlMetadata.image || 'Not found'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-700">Generating Twitter preview...</span>
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <FAQStructuredData items={faqItems} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Test a Twitter Card</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Use this twitter sharing debugger to run a comprehensive twitter cards test for any page. Our validator checks essential tags including <code className="bg-gray-200 px-1 rounded">twitter:card</code>, <code className="bg-gray-200 px-1 rounded">twitter:title</code>, <code className="bg-gray-200 px-1 rounded">twitter:description</code>, and <code className="bg-gray-200 px-1 rounded">twitter:image</code>, then renders a realistic preview of your tweet.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Verify Live Twitter Card Tags</h3>
            <p className="text-gray-600 mb-4">
              After updating your site, re-run the test to confirm the public page now exposes the new image, title, and description. LinkGlimpse does not clear or control X&apos;s platform cache.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-2 mb-2">How to Debug a Twitter Card</h3>
            <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-2">
              <li>Paste your URL and click “Preview Your Tweet Now.”</li>
              <li>Inspect the tweet and card preview, along with extracted tag values.</li>
              <li>Fix meta tags in your HTML template or CMS settings.</li>
              <li>Deploy your changes, then re-run the debugger twitter flow to verify.</li>
              <li>Share your link with confidence once the twitter card update is reflected.</li>
            </ol>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Twitter Card Best Practices</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Use <em>summary_large_image</em> for posts where the image should dominate the preview</li>
              <li>Ensure images are at least 1200×630 and under a few MB for faster loads</li>
              <li>Keep titles punchy and clear; make descriptions action-oriented</li>
              <li>Use absolute HTTPS URLs for all assets, including images</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Fix Common Twitter Card Problems</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Outdated preview? Trigger a twitter card update by changing the image filename</li>
              <li>Broken image? Verify the URL is reachable and returns 200 status</li>
              <li>No card? Confirm <code className="bg-gray-200 px-1 rounded">twitter:card</code> is set and meta tags are in the <code className="bg-gray-200 px-1 rounded">&lt;head&gt;</code></li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Why Validate a Twitter Card?</h3>
            <p className="text-gray-600 mb-4">
              A validator prevents broken previews, increases click-through rates, and helps you control brand presentation. Whether you search “debug twitter,” “debugger twitter,” or “twitter card update,” this tool provides the rapid feedback loop you need.
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
                <li>Image: Not sized for large summary, text-heavy thumbnail</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2"><strong>After:</strong> Properly sized image, concise headline, clear value.</p>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Title: “New Release: 3 Features That Make Reporting 2x Faster”</li>
                <li>Description: “Upgrade today and get simpler dashboards, faster exports, and better insights.”</li>
                <li>Image: 1200×630, minimal text, strong contrast</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Twitter Card QA Checklist</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Validate card type and all required tags using this twitter sharing debugger</li>
              <li>Confirm image is reachable, uses HTTPS, and isn’t blocked by robots</li>
              <li>Re-run after updates to ensure the twitter card refresh is reflected</li>
              <li>Verify mobile appearance to avoid unexpected cropping</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
