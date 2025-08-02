'use client';

import { useState } from 'react';
import { AlertCircle, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { 
  FacebookPreviews, 
  GoogleSearchPreview,
  TumblrPreviews,
  TwitterPreviews,
  LinkedInPreviews,
  MastodonPreviews,
  NextdoorPreviews,
  BlueskyPreviews,
  InstagramPreviews
} from '@automattic/social-previews';
import { ApiResponse } from '@/types';
import { fetchUrlMetadata } from '@/lib/url-utils';
import UrlInput from './UrlInput';
import AiEnhancer from './AiEnhancer';

export default function SocialPreview() {
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
      setError(err instanceof Error ? err.message : 'Failed to generate previews');
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

  const scrollContainer = (direction: 'left' | 'right') => {
    const container = document.getElementById('previews-carousel');
    if (container) {
      const scrollAmount = 400;
      container.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      {/* URL Input */}
      <div className="mb-8 text-left items-start">
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

      {/* AI Enhancement */}
      {urlMetadata && (
        <div className="mb-8">
          <AiEnhancer 
            metadata={urlMetadata} 
            onEnhancedMetadata={(enhancedMetadata) => setUrlMetadata(enhancedMetadata)}
          />
        </div>
      )}

      {/* Previews Carousel */}
      {urlMetadata && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Social Media Previews</h2>
          
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={() => scrollContainer('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            
            <button
              onClick={() => scrollContainer('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border border-gray-200 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
            >
              <ChevronRight className="h-6 w-6 text-gray-600" />
            </button>

            {/* Carousel Container */}
            <div 
              id="previews-carousel"
              className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {/* Facebook Preview */}
              <div className="flex-shrink-0 w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Facebook</h3>
                  <FacebookPreviews
                    title={urlMetadata.title || 'No title available'}
                    description={urlMetadata.description || 'No description available'}
                    url={urlMetadata.url}
                    image={urlMetadata.image}
                    user={{ displayName: getDomain(urlMetadata.url) }}
                  />
                </div>
              </div>

              {/* Twitter Preview */}
              <div className="flex-shrink-0 w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Twitter</h3>
                  <TwitterPreviews
                    tweets={[{
                      date: new Date(),
                      name: getDomain(urlMetadata.url),
                      profileImage: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png',
                      screenName: `@${getDomain(urlMetadata.url).replace(/\./g, '')}`,
                      text: `${urlMetadata.title || 'No title'}\n\n${urlMetadata.description || 'No description'}\n\n${urlMetadata.url}`,
                      media: urlMetadata.image ? [{
                        alt: urlMetadata.title || 'Image',
                        url: urlMetadata.image,
                        type: 'image/jpeg'
                      }] : undefined
                    }]}
                  />
                </div>
              </div>

              {/* LinkedIn Preview */}
              <div className="flex-shrink-0 w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">LinkedIn</h3>
                  <LinkedInPreviews
                    title={urlMetadata.title || 'No title available'}
                    description={urlMetadata.description || 'No description available'}
                    url={urlMetadata.url}
                    image={urlMetadata.image}
                    name={getDomain(urlMetadata.url)}
                    profileImage="https://static.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q"
                    jobTitle="Website"
                  />
                </div>
              </div>

              {/* Google Search Preview */}
              <div className="flex-shrink-0 w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Google Search</h3>
                  <GoogleSearchPreview
                    title={urlMetadata.title || 'No title available'}
                    description={urlMetadata.description || 'No description available'}
                    url={urlMetadata.url}
                    siteTitle={urlMetadata.siteName || getDomain(urlMetadata.url)}
                  />
                </div>
              </div>

              {/* Tumblr Preview */}
              <div className="flex-shrink-0 w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Tumblr</h3>
                  <TumblrPreviews
                    title={urlMetadata.title || 'No title available'}
                    description={urlMetadata.description || 'No description available'}
                    url={urlMetadata.url}
                    image={urlMetadata.image}
                    user={{ displayName: getDomain(urlMetadata.url) }}
                  />
                </div>
              </div>

              {/* Mastodon Preview */}
              <div className="flex-shrink-0 w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mastodon</h3>
                  <MastodonPreviews
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
              </div>

              {/* Nextdoor Preview */}
              <div className="flex-shrink-0 w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Nextdoor</h3>
                  <NextdoorPreviews
                    title={urlMetadata.title || 'No title available'}
                    description={urlMetadata.description || 'No description available'}
                    url={urlMetadata.url}
                    image={urlMetadata.image}
                    name={getDomain(urlMetadata.url)}
                    profileImage="https://static.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q"
                  />
                </div>
              </div>

              {/* Bluesky Preview */}
              <div className="flex-shrink-0 w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Bluesky</h3>
                  <BlueskyPreviews
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
                </div>
              </div>

              {/* Instagram Preview */}
              <div className="flex-shrink-0 w-80 snap-start">
                <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Instagram</h3>
                  <InstagramPreviews
                    image={urlMetadata.image}
                    name={getDomain(urlMetadata.url)}
                    profileImage="https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png"
                    caption={`${urlMetadata.title || 'No title'}\n\n${urlMetadata.description || 'No description'}\n\n${urlMetadata.url}`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-700">Generating previews...</span>
          </div>
        </div>
      )}
    </div>
  );
}