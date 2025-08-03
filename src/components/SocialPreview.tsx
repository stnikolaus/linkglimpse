'use client';

import { useState } from 'react';
import { AlertCircle, Globe } from 'lucide-react';
import { 
  FacebookPreview, 
  GoogleSearchPreview,
  TumblrPreview,
  TwitterPreview,
  LinkedInPreview,
  MastodonPreview,
  NextdoorPreview,
  BlueskyPreview,
  InstagramPreview,
  ThreadsPreview
} from './social-previews';
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

  return (
    <div className="w-full">
      {/* URL Input */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8 text-left items-start">
          <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} />
        </div>
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

      {/* Social Previews Wall */}
      {urlMetadata && (
        <div className="space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Social Media Previews</h2>
          
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-4 px-4">
            {/* Facebook Preview */}
            <div className="p-4 mb-4 break-inside-avoid min-w-[460px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Facebook</h3>
              <FacebookPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                url={urlMetadata.url}
                image={urlMetadata.image}
                user={{ displayName: getDomain(urlMetadata.url) }}
              />
            </div>

            {/* Instagram Preview */}
            <div className="p-4 mb-4 break-inside-avoid min-w-[460px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instagram</h3>
              <InstagramPreview
                image={urlMetadata.image}
                name={getDomain(urlMetadata.url)}
                profileImage="https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png"
                caption={`${urlMetadata.title || 'No title'}\n\n${urlMetadata.description || 'No description'}\n\n${urlMetadata.url}`}
              />
            </div>

            {/* Threads Preview */}
            <div className="p-4 mb-4 break-inside-avoid min-w-[460px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Threads</h3>
              <ThreadsPreview
                posts={[{
                  date: new Date(),
                  name: getDomain(urlMetadata.url),
                  profileImage: 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png',
                  caption: `${urlMetadata.title || 'No title'}\n\n${urlMetadata.description || 'No description'}\n\n${urlMetadata.url}`,
                  image: urlMetadata.image,
                  title: urlMetadata.title || 'No title available',
                  url: urlMetadata.url,
                  media: urlMetadata.image ? [{
                    alt: urlMetadata.title || 'Image',
                    url: urlMetadata.image,
                    type: 'image/jpeg'
                  }] : undefined
                }]}
              />
            </div>

            {/* LinkedIn Preview */}
            <div className="p-4 mb-4 break-inside-avoid min-w-[460px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">LinkedIn</h3>
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

            {/* Twitter Preview */}
            <div className="p-4 mb-4 break-inside-avoid min-w-[460px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Twitter</h3>
              <TwitterPreview
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

            {/* Google Search Preview */}
            <div className="p-4 mb-4 break-inside-avoid min-w-[460px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Search</h3>
              <GoogleSearchPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                url={urlMetadata.url}
                siteTitle={urlMetadata.siteName}
              />
            </div>

            {/* Tumblr Preview */}
            <div className="p-4 mb-4 break-inside-avoid min-w-[460px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Tumblr</h3>
              <TumblrPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                url={urlMetadata.url}
                image={urlMetadata.image}
                user={{ displayName: getDomain(urlMetadata.url) }}
              />
            </div>

            {/* Mastodon Preview */}
            <div className="p-4 mb-4 break-inside-avoid min-w-[460px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Mastodon</h3>
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

            {/* Nextdoor Preview */}
            <div className="p-4 mb-4 break-inside-avoid min-w-[460px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Nextdoor</h3>
              <NextdoorPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                url={urlMetadata.url}
                image={urlMetadata.image}
                name={getDomain(urlMetadata.url)}
                profileImage="https://static.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q"
              />
            </div>

            {/* Bluesky Preview */}
            <div className="p-4 mb-4 break-inside-avoid min-w-[460px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bluesky</h3>
              <BlueskyPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                customText={`${urlMetadata.title || 'No title'}\n\n${urlMetadata.description || 'No description'}\n\n${urlMetadata.url}`}
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
        </div>
      )}

      {/* AI Enhancement */}
      {urlMetadata && (
        <div className="mb-8 max-w-7xl mx-auto px-4 mt-12">
          <AiEnhancer 
            metadata={urlMetadata} 
            onEnhancedMetadata={(enhancedMetadata) => setUrlMetadata(enhancedMetadata)}
          />
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