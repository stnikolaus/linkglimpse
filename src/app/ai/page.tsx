
import type { Metadata } from 'next';

import { AlertCircle, ArrowLeft, Sparkles, Wand2, Brain, Zap, CheckCircle, Copy, Download } from 'lucide-react';
import Link from 'next/link';
import AiEnhancer from '@/components/AiEnhancer';

export const metadata: Metadata = {
  title: 'AI Enhancement - Social Preview Generator',
  description: 'Enhance your social media previews with AI. Generate optimized titles, descriptions, and Open Graph tags using artificial intelligence for better social media engagement.',
  keywords: 'ai enhancement, social media ai, open graph ai, meta tags ai, social preview ai, content optimization ai',
  openGraph: {
    title: 'AI Enhancement - Social Preview Generator',
    description: 'Enhance your social media previews with AI. Generate optimized titles, descriptions, and Open Graph tags using artificial intelligence for better social media engagement.',
    type: 'website',
    url: 'https://social-preview-generator.com/ai',
    siteName: 'Social Preview Generator',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Enhancement - Social Preview Generator',
    description: 'Enhance your social media previews with AI. Generate optimized titles, descriptions, and Open Graph tags using artificial intelligence for better social media engagement.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function AiPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-full">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">AI-Powered Social Preview Enhancement</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Enhance your social media previews with artificial intelligence. Generate optimized titles, descriptions, 
            and Open Graph tags that will improve engagement across all social platforms.
          </p>
        </div>

        {/* AI Enhancer Component */}
        <div className="mb-12">
          <AiEnhancer />
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">AI Enhancement Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Content Analysis</h3>
              <p className="text-gray-600">
                AI analyzes your content and suggests optimized titles and descriptions that will perform better on social media.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-pink-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Wand2 className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Platform Optimization</h3>
              <p className="text-gray-600">
                Generate platform-specific optimizations for Facebook, Twitter, LinkedIn, and other social networks.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600">
                Get AI-enhanced previews instantly with real-time optimization and immediate feedback.
              </p>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">How AI Enhancement Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">1</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Input URL</h4>
              <p className="text-gray-600 text-sm">
                Enter any URL you want to enhance for social media sharing.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">2</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">AI Analysis</h4>
              <p className="text-gray-600 text-sm">
                Our AI analyzes the content and identifies optimization opportunities.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">3</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Generate Enhancements</h4>
              <p className="text-gray-600 text-sm">
                AI generates optimized titles, descriptions, and meta tags.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-lg">4</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Preview & Export</h4>
              <p className="text-gray-600 text-sm">
                See the enhanced previews and export the optimized code.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 