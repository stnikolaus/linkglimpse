'use client';

import { useState } from 'react';
import { ApiResponse, AiEnhancementResult } from '@/types';
import { Sparkles, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface AiEnhancerProps {
  metadata: ApiResponse;
  onEnhancedMetadata: (enhancedMetadata: ApiResponse) => void;
}

export default function AiEnhancer({ metadata, onEnhancedMetadata }: AiEnhancerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [enhancementResult, setEnhancementResult] = useState<AiEnhancementResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'twitter', 'linkedin']);

  const availablePlatforms = [
    { id: 'facebook', name: 'Facebook' },
    { id: 'twitter', name: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'instagram', name: 'Instagram' },
    { id: 'tiktok', name: 'TikTok' }
  ];

  const handleEnhance = async () => {
    setIsLoading(true);
    setError(null);
    setEnhancementResult(null);

    try {
      const response = await fetch('/api/enhance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metadata,
          platforms: selectedPlatforms
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to enhance metadata');
      }

      setEnhancementResult(data.enhancements);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyEnhancement = () => {
    if (!enhancementResult) return;

    const enhancedMetadata: ApiResponse = {
      ...metadata,
      title: enhancementResult.title.optimized,
      description: enhancementResult.description.optimized,
    };

    onEnhancedMetadata(enhancedMetadata);
  };

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platformId) 
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="h-5 w-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-gray-900">AI-Powered Enhancement</h3>
      </div>

      {/* Platform Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Target Platforms
        </label>
        <div className="flex flex-wrap gap-2">
          {availablePlatforms.map((platform) => (
            <button
              key={platform.id}
              onClick={() => togglePlatform(platform.id)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedPlatforms.includes(platform.id)
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {platform.name}
            </button>
          ))}
        </div>
      </div>

      {/* Enhance Button */}
      <button
        onClick={handleEnhance}
        disabled={isLoading || selectedPlatforms.length === 0}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Enhancing...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            Enhance with AI
          </div>
        )}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        </div>
      )}

      {/* Enhancement Results */}
      {enhancementResult && (
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-md font-semibold text-gray-900">Enhancement Results</h4>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Overall Score:</span>
              <span className="text-lg font-bold text-purple-600">
                {enhancementResult.overallScore}/100
              </span>
            </div>
          </div>

          {/* Title Enhancement */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-900">Title Optimization</h5>
              <span className="text-sm font-medium text-purple-600">
                {enhancementResult.title.score}/100
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Original:</span>
                <p className="text-gray-900">{metadata.title || 'No title'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Optimized:</span>
                <p className="text-green-700 font-medium">{enhancementResult.title.optimized}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Feedback:</span>
                <p className="text-sm text-gray-700">{enhancementResult.title.feedback}</p>
              </div>
            </div>
          </div>

          {/* Description Enhancement */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-medium text-gray-900">Description Optimization</h5>
              <span className="text-sm font-medium text-purple-600">
                {enhancementResult.description.score}/100
              </span>
            </div>
            <div className="space-y-2">
              <div>
                <span className="text-sm text-gray-600">Original:</span>
                <p className="text-gray-900">{metadata.description || 'No description'}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Optimized:</span>
                <p className="text-green-700 font-medium">{enhancementResult.description.optimized}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Feedback:</span>
                <p className="text-sm text-gray-700">{enhancementResult.description.feedback}</p>
              </div>
            </div>
          </div>

          {/* Hashtags */}
          {enhancementResult.hashtags.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Suggested Hashtags</h5>
              <div className="flex flex-wrap gap-2">
                {enhancementResult.hashtags.map((hashtag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                  >
                    {hashtag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Platform Optimizations */}
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-900 mb-3">Platform-Specific Optimizations</h5>
            <div className="space-y-3">
              {Object.entries(enhancementResult.platformOptimizations).map(([platform, data]) => (
                <div key={platform} className="border-l-4 border-purple-200 pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-gray-900 capitalize">{platform}</span>
                    <span className="text-sm font-medium text-purple-600">
                      {(data as { score: number }).score}/100
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{(data as { feedback: string }).feedback}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Improvements */}
          {enhancementResult.improvements.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Improvement Suggestions</h5>
              <ul className="space-y-1">
                {enhancementResult.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-purple-600 mt-0.5">•</span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Apply Button */}
          <button
            onClick={handleApplyEnhancement}
            className="w-full bg-green-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="h-4 w-4" />
            Apply Enhanced Metadata
          </button>
        </div>
      )}
    </div>
  );
} 