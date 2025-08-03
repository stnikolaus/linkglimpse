'use client';

import { useState } from 'react';
import { AlertCircle, ArrowLeft, Instagram } from 'lucide-react';
import Link from 'next/link';
import { InstagramPreview } from '@/components/social-previews';
import { ApiResponse } from '@/types';
import { fetchUrlMetadata } from '@/lib/url-utils';
import UrlInput from '@/components/UrlInput';

export default function InstagramSocialPreview() {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-pink-500 to-purple-500 p-3 rounded-full">
              <Instagram className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Instagram Social Preview</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            See exactly how your content will appear when shared on Instagram. 
            Preview photo posts with captions and engagement elements.
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
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Instagram className="h-6 w-6 text-pink-600 mr-3" />
                <h2 className="text-2xl font-semibold text-gray-900">Instagram Preview</h2>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6">
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
              </div>

              {/* Metadata Info */}
              <div className="mt-8 p-6 bg-pink-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Metadata</h3>
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
            <div className="inline-flex items-center px-4 py-2 bg-pink-50 border border-pink-200 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-600 mr-2"></div>
              <span className="text-pink-700">Generating Instagram preview...</span>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">About Instagram Social Previews</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-4">
              Instagram uses Open Graph meta tags to determine how your content appears when shared. 
              The preview shows exactly how your link will look in Instagram stories and posts.
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Key Instagram Meta Tags:</h4>
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