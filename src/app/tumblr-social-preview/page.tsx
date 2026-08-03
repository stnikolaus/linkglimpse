'use client';

import { useState } from 'react';
import { AlertCircle, MessageCircle } from 'lucide-react';
import { TumblrPreview } from '@/components/social-previews';
import { ApiResponse } from '@/types';
import { fetchUrlMetadata } from '@/lib/url-utils';
import UrlInput from '@/components/UrlInput';
import DiagnosticsPanel from '@/components/DiagnosticsPanel';

export default function TumblrSocialPreview() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlMetadata, setUrlMetadata] = useState<ApiResponse | null>(null);

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    setError('');
    setUrlMetadata(null);

    try {
      const fetchedMetadata = await fetchUrlMetadata(url);

      if (fetchedMetadata.error) {
        throw new Error(fetchedMetadata.error);
      }

      setUrlMetadata(fetchedMetadata);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
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
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-500 p-3 rounded-full">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tumblr Link Preview Tool</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preview how a public URL may appear in a Tumblr post. Check the representative link card, title, description and image before sharing.
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

        {/* Tumblr Preview */}
        {urlMetadata && (
          <DiagnosticsPanel
            metadata={urlMetadata}
            previewTitle="Tumblr link preview"
            preview={(
              <TumblrPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                url={urlMetadata.url}
                image={urlMetadata.image}
                user={{ displayName: getDomain(urlMetadata.url) }}
              />
            )}
          />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
              <span className="text-blue-700">Generating Tumblr preview...</span>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How Tumblr Link Previews Use Metadata</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Tumblr uses Open Graph meta tags to determine how your content appears when shared.
              The preview approximates a Tumblr link card; the live platform may render it differently.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Key Tumblr Meta Tags:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><code className="bg-gray-200 px-1 rounded">og:title</code> - The title of your content</li>
                <li><code className="bg-gray-200 px-1 rounded">og:description</code> - A brief description</li>
                <li><code className="bg-gray-200 px-1 rounded">og:image</code> - The image to display</li>
                <li><code className="bg-gray-200 px-1 rounded">og:url</code> - The canonical URL</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
