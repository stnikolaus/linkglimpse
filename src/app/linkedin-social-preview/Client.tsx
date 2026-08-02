"use client";

import { useState } from 'react';
import { AlertCircle, Linkedin } from 'lucide-react';
import { LinkedInPreview } from '@/components/social-previews';
import { ApiResponse } from '@/types';
import { fetchUrlMetadata } from '@/lib/url-utils';
import UrlInput from '@/components/UrlInput';
import FAQStructuredData from '@/components/FAQStructuredData';
import DiagnosticsPanel from '@/components/DiagnosticsPanel';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';

export default function LinkedInSocialPreviewClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlMetadata, setUrlMetadata] = useState<ApiResponse | null>(null);
  const analytics = useLinkGlimpseAnalytics();

  const faqItems = [
    {
      question: 'What is a LinkedIn Post Inspector?',
      answer: 'A LinkedIn Post Inspector (debugger linkedin / linkedin share debugger) previews and validates how a URL will render inside LinkedIn posts. It helps you debug linkedin meta tags, detect issues, and ensure your link looks professional before publishing.'
    },
    {
      question: 'How do I preview a link on LinkedIn?',
      answer: 'Paste your URL above and click the button to generate a live preview. Our linkedin open graph debugger extracts og:title, og:description, og:image, and og:url to display what people will see on LinkedIn.'
    },
    {
      question: 'Why does a professional-looking preview matter on LinkedIn?',
      answer: 'Executives and buyers judge credibility fast. Strong images, clear titles, and concise descriptions improve engagement and click-through from LinkedIn\'s professional audience.'
    },
    {
      question: 'Is this the same as LinkedIn\'s own sharing debugger?',
      answer: 'No. LinkedIn\'s official Post Inspector can request a fresh scrape from LinkedIn. LinkGlimpse inspects the live public metadata and renders a representative preview, but it cannot change LinkedIn\'s cache.'
    }
  ];

  const handleUrlSubmit = async (url: string) => {
    const startedAt = performance.now();
    setIsLoading(true);
    setError('');
    setUrlMetadata(null);
    analytics.trackPreviewStarted('linkedin-preview', url);

    try {
      const fetchedMetadata = await fetchUrlMetadata(url);
      if (fetchedMetadata.error) {
        throw new Error(fetchedMetadata.error);
      }
      setUrlMetadata(fetchedMetadata);
      analytics.trackPreviewSucceeded('linkedin-preview', fetchedMetadata, Math.round(performance.now() - startedAt));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate preview';
      setError(message);
      analytics.trackPreviewFailed('linkedin-preview', url, message);
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
            <div className="bg-blue-700 p-3 rounded-full">
              <Linkedin className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">LinkedIn Post Inspector Alternative</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preview a LinkedIn link post and inspect its live Open Graph tags, redirects and image. Diagnose metadata issues without changing LinkedIn&apos;s cache.
          </p>
        </div>

        <div className="mb-8">
          <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} ctaLabel="Preview on LinkedIn" placeholder="Paste a URL to preview on LinkedIn" />
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
                <Linkedin className="h-6 w-6 text-blue-700 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">LinkedIn Link Preview Result</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <LinkedInPreview
                  title={urlMetadata.title || 'No title available'}
                  description={urlMetadata.description || 'No description available'}
                  url={urlMetadata.url}
                  image={urlMetadata.image}
                  name={getDomain(urlMetadata.url)}
                  profileImage="https://static.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q"
                  jobTitle="Website"
                />
              </div>

              <div className="mt-8 p-6 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">LinkedIn Open Graph Metadata</h3>
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
              <span className="text-blue-700">Generating LinkedIn preview...</span>
            </div>
          </div>
        )}

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <FAQStructuredData items={faqItems} />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How This LinkedIn Post Inspector Alternative Works</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              This linked in debugger (linked debugger) functions as a streamlined linkedin debug workflow. Paste a URL, preview, and fix common issues with title length, image dimensions, and missing tags. The linkedin link debugger is ideal for marketers and founders who need speed and accuracy.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Validate LinkedIn Open Graph Tags</h3>
            <p className="text-gray-600 mb-4">
              Ensure <code className="bg-gray-200 px-1 rounded">og:title</code>, <code className="bg-gray-200 px-1 rounded">og:description</code>, <code className="bg-gray-200 px-1 rounded">og:image</code>, and <code className="bg-gray-200 px-1 rounded">og:url</code> are present and optimized for LinkedIn&rsquo;s layout.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">How to Debug a LinkedIn Link</h3>
            <ol className="text-sm text-gray-600 list-decimal pl-5 space-y-2">
              <li>Paste your URL and click “Preview on LinkedIn.”</li>
              <li>Review the preview and verify extracted Open Graph values.</li>
              <li>Adjust titles and descriptions for clarity and outcomes.</li>
              <li>Optimize image size (1200×627+) and retest with the linkedin sharing debugger.</li>
              <li>Publish once the preview reflects your desired brand presentation.</li>
            </ol>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">LinkedIn Preview Best Practices</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Lead with value: emphasize benefits or results in the title</li>
              <li>Use concise copy targeting decision-makers and peers</li>
              <li>Prefer clean, high-contrast imagery aligned with your brand</li>
              <li>Keep URLs canonical and consistent across campaigns</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Fix Common LinkedIn Preview Problems</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Image not showing? Confirm the asset is public, HTTPS, and under size limits</li>
              <li>Wrong title? Ensure your CMS outputs one set of <code className="bg-gray-200 px-1 rounded">og:title</code> tags</li>
              <li>Outdated preview? Update tags and re-run this linkedin sharing debugger</li>
            </ul>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">Why Inspect a LinkedIn Link Preview?</h3>
            <p className="text-gray-600 mb-4">
              The linkedin share debugger view influences click-through, credibility, and conversation quality. If you search “debugger linkedin,” “linkedin debug,” or “linkedin sharing debugger,” you are likely optimizing for professional impact—this tool helps you do that quickly.
            </p>
            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">LinkedIn Preview Optimization Examples</h3>
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-2"><strong>Before:</strong> Stock image, generic title, broad description.</p>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Title: “We&rsquo;re Launching A New Solution For Businesses”</li>
                <li>Description: “Our platform is flexible and customizable.”</li>
                <li>Image: Abstract background with small text</li>
              </ul>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-2"><strong>After:</strong> Professional image, outcome-based title, targeted description.</p>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Title: “Cut Vendor Onboarding From 14 Days To 48 Hours”</li>
                <li>Description: “A secure workflow built for procurement teams. SOC 2. SSO. Audit-ready.”</li>
                <li>Image: Clean product shot or team photo with ample whitespace</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">LinkedIn Link Preview QA Checklist</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
              <li>Verify <code className="bg-gray-200 px-1 rounded">og:title</code> and <code className="bg-gray-200 px-1 rounded">og:description</code> align with executive-friendly messaging</li>
              <li>Ensure <code className="bg-gray-200 px-1 rounded">og:image</code> has clarity on mobile and desktop</li>
              <li>Confirm canonical URL is final and public</li>
              <li>Test the linkedin share debugger view to avoid last-minute surprises</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">LinkedIn Post Inspector Questions</h2>
            <div className="space-y-4">
              {faqItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
                  <p className="text-gray-600">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
