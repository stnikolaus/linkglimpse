'use client';

import { Copy, ExternalLink } from 'lucide-react';
import { PreviewCardProps } from '@/types';
import { useState } from 'react';
import Image from 'next/image';

const platformConfig = {
  facebook: {
    name: 'Facebook',
    color: 'bg-blue-600',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-600',
  },
  twitter: {
    name: 'Twitter',
    color: 'bg-sky-500',
    borderColor: 'border-sky-200',
    textColor: 'text-sky-500',
  },
  linkedin: {
    name: 'LinkedIn',
    color: 'bg-blue-700',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
  },
  whatsapp: {
    name: 'WhatsApp',
    color: 'bg-green-500',
    borderColor: 'border-green-200',
    textColor: 'text-green-500',
  },
  slack: {
    name: 'Slack',
    color: 'bg-purple-500',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-500',
  },
  discord: {
    name: 'Discord',
    color: 'bg-indigo-500',
    borderColor: 'border-indigo-200',
    textColor: 'text-indigo-500',
  },
};

export default function PreviewCard({ preview, platform }: PreviewCardProps) {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);
  const config = platformConfig[platform as keyof typeof platformConfig] || platformConfig.facebook;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
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
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Platform Header */}
      <div className={`px-4 py-2 ${config.color} text-white flex items-center justify-between`}>
        <span className="font-medium">{config.name}</span>
        <button
          onClick={() => copyToClipboard(`${preview.title}\n\n${preview.description}\n\n${preview.url}`)}
          className="text-white/80 hover:text-white transition-colors"
          title="Copy preview text"
        >
          <Copy className="h-4 w-4" />
        </button>
      </div>

      {/* Preview Content */}
      <div className="p-4">
        {preview.image && !imageError && (
          <div className="mb-3 relative h-32">
            <Image
              src={preview.image}
              alt={preview.title}
              fill
              className="object-cover rounded"
              onError={() => setImageError(true)}
              unoptimized
            />
          </div>
        )}

        <div className="space-y-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2">
            {preview.title || 'No title available'}
          </h3>
          
          <p className="text-sm text-gray-600 line-clamp-3">
            {preview.description || 'No description available'}
          </p>
          
          <div className="flex items-center text-xs text-gray-500">
            <span className="truncate">{getDomain(preview.url)}</span>
            <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
          </div>
        </div>
      </div>

      {/* Copy Success Message */}
      {copied && (
        <div className="px-4 py-2 bg-green-50 border-t border-green-200">
          <p className="text-sm text-green-600">Copied to clipboard!</p>
        </div>
      )}
    </div>
  );
} 