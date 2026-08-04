'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';
import type { ApiResponse } from '@/types';
import { fetchUrlMetadata } from '@/lib/url-utils';
import UrlInput from './UrlInput';
import DiagnosticsPanel from './DiagnosticsPanel';
import { useLinkGlimpseAnalytics } from './PlausibleEvents';
import SocialPreviewTabs from './SocialPreviewTabs';

interface SocialPreviewProps {
  surface?: string;
  initialUrl?: string;
  afterInput?: ReactNode;
}

export default function SocialPreview({ surface = 'all-platforms', initialUrl, afterInput }: SocialPreviewProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [urlMetadata, setUrlMetadata] = useState<ApiResponse | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const initialUrlLoaded = useRef(false);
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

  useEffect(() => {
    if (!initialUrl || initialUrlLoaded.current) return;
    initialUrlLoaded.current = true;
    void handleUrlSubmit(initialUrl);
    // The initial report URL should run once; later checks come from the form.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUrl]);

  return (
    <div className="w-full">
      {/* URL Input */}
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 text-left">
          <UrlInput onSubmit={handleUrlSubmit} isLoading={isLoading} initialValue={initialUrl} />
          {afterInput}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="max-w-6xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Social Previews Wall */}
      {urlMetadata && (
        <div ref={resultsRef} className="max-w-6xl mx-auto px-4 scroll-mt-24">
          <DiagnosticsPanel
            metadata={urlMetadata}
            previewTitle="Social media previews"
            preview={<SocialPreviewTabs metadata={urlMetadata} />}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="max-w-6xl mx-auto text-center py-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-700">Generating previews...</span>
          </div>
        </div>
      )}
    </div>
  );
}
