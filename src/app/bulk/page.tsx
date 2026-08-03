import type { Metadata } from 'next';
import BulkProcessor from '@/components/BulkProcessor';

export const metadata: Metadata = {
  title: 'Bulk URL Metadata Checker',
  description: 'Check Open Graph, Twitter Card and page metadata for up to 100 URLs at once. Compare issues and export the results as CSV or JSON.',
  keywords: 'bulk url processing, social media preview batch, url preview generator, csv export, json export, batch processing',
  alternates: { canonical: '/bulk' },
  openGraph: {
    title: 'Bulk URL Metadata Checker',
    description: 'Check Open Graph, Twitter Card and page metadata for up to 100 URLs at once. Compare issues and export the results as CSV or JSON.',
    type: 'website',
    url: 'https://www.linkglimpse.com/bulk',
    siteName: 'LinkGlimpse',
    images: ['/images/icon/social-preview-1200x630.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bulk URL Metadata Checker',
    description: 'Check Open Graph, Twitter Card and page metadata for up to 100 URLs at once. Compare issues and export the results as CSV or JSON.',
    images: ['/images/icon/social-preview-1200x630.jpeg'],
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
            <h2 className="text-2xl font-bold text-gray-900 mb-6">How to Check Metadata for Multiple URLs</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Upload or Enter URLs</h3>
                <p className="text-gray-600">
                  Upload a text file with URLs (one per line) or paste URLs directly into the text area.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-purple-600 font-bold">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Choose an Export Format</h3>
                <p className="text-gray-600">
                  Choose JSON for full diagnostics or CSV for a spreadsheet-friendly comparison.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <span className="text-green-600 font-bold">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Check and Export Metadata</h3>
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
