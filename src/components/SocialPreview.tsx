'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertCircle } from 'lucide-react';
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
import DiagnosticsPanel from './DiagnosticsPanel';
import { useLinkGlimpseAnalytics } from './PlausibleEvents';

interface SocialPreviewProps {
  surface?: string;
}

export default function SocialPreview({ surface = 'all-platforms' }: SocialPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlMetadata, setUrlMetadata] = useState<ApiResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const analytics = useLinkGlimpseAnalytics();

  useEffect(() => {
    if (!urlMetadata) return;

    const animationFrame = window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    return () => window.cancelAnimationFrame(animationFrame);
  }, [urlMetadata]);

  const handleUrlSubmit = async (url: string) => {
    const startedAt = performance.now();
    setIsLoading(true);
    setError('');
    setUrlMetadata(null);
    analytics.trackPreviewStarted(surface, url);

    try {
      const fetchedMetadata = await fetchUrlMetadata(url);
      
      if (fetchedMetadata.error) {
        throw new Error(fetchedMetadata.error);
      }

      setUrlMetadata(fetchedMetadata);
      analytics.trackPreviewSucceeded(surface, fetchedMetadata, Math.round(performance.now() - startedAt));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate previews';
      setError(message);
      analytics.trackPreviewFailed(surface, url, message);
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
        <div ref={resultsRef} className="scroll-mt-24 space-y-8">
          <h2 className="text-2xl font-semibold text-gray-900 text-center">Social Media Previews</h2>
          
          <div
            aria-label="Social preview gallery"
            className="social-preview-strip flex w-full snap-x snap-proximity items-start gap-3 overflow-x-auto px-3 pb-4"
            role="region"
            tabIndex={0}
          >
            {/* Facebook Preview */}
            <div className="social-preview-strip-item w-[clamp(320px,32vw,500px)] min-w-0 flex-none snap-start overflow-hidden">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Facebook</h3>
              <FacebookPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                url={urlMetadata.url}
                image={urlMetadata.image}
                user={{ displayName: getDomain(urlMetadata.url) }}
              />
            </div>

            {/* Instagram Preview */}
            <div className="social-preview-strip-item w-[clamp(320px,32vw,500px)] min-w-0 flex-none snap-start overflow-hidden">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Instagram</h3>
              <InstagramPreview
                image={urlMetadata.image}
                name={getDomain(urlMetadata.url)}
                profileImage="https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png"
                caption={`${urlMetadata.title || 'No title'}\n\n${urlMetadata.description || 'No description'}\n\n${urlMetadata.url}`}
              />
            </div>

            {/* Threads Preview */}
            <div className="social-preview-strip-item w-[clamp(320px,32vw,500px)] min-w-0 flex-none snap-start overflow-hidden">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Threads</h3>
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
            <div className="social-preview-strip-item w-[clamp(320px,32vw,500px)] min-w-0 flex-none snap-start overflow-hidden">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">LinkedIn</h3>
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
            <div className="social-preview-strip-item w-[clamp(320px,32vw,500px)] min-w-0 flex-none snap-start overflow-hidden">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Twitter</h3>
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
            <div className="social-preview-strip-item w-[clamp(320px,32vw,500px)] min-w-0 flex-none snap-start overflow-hidden">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Google Search</h3>
              <GoogleSearchPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                url={urlMetadata.url}
                siteTitle={urlMetadata.siteName}
              />
            </div>

            {/* Tumblr Preview */}
            <div className="social-preview-strip-item w-[clamp(320px,32vw,500px)] min-w-0 flex-none snap-start overflow-hidden">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Tumblr</h3>
              <TumblrPreview
                title={urlMetadata.title || 'No title available'}
                description={urlMetadata.description || 'No description available'}
                url={urlMetadata.url}
                image={urlMetadata.image}
                user={{ displayName: getDomain(urlMetadata.url) }}
              />
            </div>

            {/* Mastodon Preview */}
            <div className="social-preview-strip-item w-[clamp(320px,32vw,500px)] min-w-0 flex-none snap-start overflow-hidden">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Mastodon</h3>
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
            <div className="social-preview-strip-item w-[clamp(320px,32vw,500px)] min-w-0 flex-none snap-start overflow-hidden">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Nextdoor</h3>
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
            <div className="social-preview-strip-item w-[clamp(320px,32vw,500px)] min-w-0 flex-none snap-start overflow-hidden">
              <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">Bluesky</h3>
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

          <DiagnosticsPanel metadata={urlMetadata} />
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
