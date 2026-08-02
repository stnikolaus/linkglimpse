'use client';

import { useState } from 'react';
import { AlertCircle, Users } from 'lucide-react';
import { MastodonPreview } from '@/components/social-previews';
import { ApiResponse } from '@/types';
import { fetchUrlMetadata } from '@/lib/url-utils';
import UrlInput from '@/components/UrlInput';

export default function MastodonSocialPreview() {
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 pt-16">

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-purple-600 p-3 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Mastodon Link Preview Tool</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Preview how a public URL may appear in a Mastodon post. Check the representative Open Graph card, title, description and image before sharing.
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

        {/* Mastodon Preview */}
        {urlMetadata && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-purple-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Mastodon Link Preview Result</h2>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <MastodonPreview
                  title={urlMetadata.title || 'No title available'}
                  description={urlMetadata.description || 'No description available'}
                  url={urlMetadata.url}
                  image={urlMetadata.image}
                  user={{
                    displayName: getDomain(urlMetadata.url),
                    avatarUrl: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png',
                    address: `@${getDomain(urlMetadata.url).replace(/\./g, '')}@mastodon.social`
                  }}
                />
              </div>

              {/* Metadata Info */}
              <div className="mt-8 p-6 bg-purple-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Mastodon Preview Metadata</h3>
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

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-flex items-center px-4 py-2 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
              <span className="text-purple-700">Generating Mastodon preview...</span>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">How Mastodon Link Previews Use Metadata</h2>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Mastodon uses Open Graph meta tags to determine how your content appears when shared.
              The preview approximates a link card; individual Mastodon servers can render metadata differently.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Key Mastodon Meta Tags:</h4>
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
