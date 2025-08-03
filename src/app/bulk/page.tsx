import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import BulkProcessor from '@/components/BulkProcessor';

export const metadata: Metadata = {
  title: 'Bulk URL Processing - LinkGlimpse',
  description: 'Process up to 100 URLs at once with our bulk URL processor. Generate social media previews for multiple URLs and export results in JSON or CSV format.',
  keywords: 'bulk url processing, social media preview batch, url preview generator, csv export, json export, batch processing',
  openGraph: {
    title: 'Bulk URL Processing - LinkGlimpse',
    description: 'Process up to 100 URLs at once with our bulk URL processor. Generate social media previews for multiple URLs and export results in JSON or CSV format.',
    type: 'website',
    url: 'https://www.linkglimpse.com/bulk',
    siteName: 'LinkGlimpse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk URL Processing - LinkGlimpse',
    description: 'Process up to 100 URLs at once with our bulk URL processor. Generate social media previews for multiple URLs and export results in JSON or CSV format.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BulkPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">

      {/* Main Content */}
      <div className="py-8">
        <BulkProcessor />
      </div>

      {/* Info Section */}
      <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">How to Use Bulk Processing</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Upload or Enter URLs</h4>
                <p className="text-gray-600">
                  Upload a text file with URLs (one per line) or paste URLs directly into the text area.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Configure Settings</h4>
                <p className="text-gray-600">
                  Select which social platforms to analyze and choose your preferred export format.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">Process & Export</h4>
                <p className="text-gray-600">
                  Process up to 100 URLs at once and download results in JSON or CSV format.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 