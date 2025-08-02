'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Code, 
  Globe, 
  Zap, 
  CheckCircle, 
  AlertCircle, 
  Copy, 
  ExternalLink,
  Play,
  FileText,
  Shield,
  ArrowLeft
} from 'lucide-react';

export default function ApiPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [testUrl, setTestUrl] = useState('https://example.com');
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const testApi = async () => {
    if (!testUrl.trim()) {
      setTestResult('Please enter a valid URL');
      return;
    }

    setIsTesting(true);
    setTestResult('');

    try {
      const response = await fetch(`/preview?url=${encodeURIComponent(testUrl)}&platforms=facebook,twitter,linkedin,google`);
      const data = await response.json();
      
      setTestResult(JSON.stringify(data, null, 2));
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Failed to test API'}`);
    } finally {
      setIsTesting(false);
    }
  };

  const exampleUrl = 'https://example.com';
  const apiUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/preview?url=${exampleUrl}&platforms=facebook,twitter,linkedin`;

  const features = [
    {
      icon: Globe,
      title: 'URL Analysis',
      description: 'Extract metadata from any URL including Open Graph, Twitter Cards, and standard meta tags'
    },
    {
      icon: CheckCircle,
      title: 'Missing Data Detection',
      description: 'Get notified about missing social media metadata that could improve your previews'
    },
    {
      icon: Code,
      title: 'Platform-Specific Data',
      description: 'Receive formatted data optimized for each social platform'
    },
    {
      icon: ExternalLink,
      title: 'Iframe URLs',
      description: 'Get direct iframe URLs for embedding previews in your applications'
    },
    {
      icon: Shield,
      title: 'Free & Open',
      description: 'No authentication required, completely free for everyone'
    },
    {
      icon: Zap,
      title: 'Fast & Reliable',
      description: 'Built on Next.js with server-side processing for optimal performance'
    }
  ];

  const platforms = [
    { name: 'Facebook', key: 'facebook', color: 'bg-blue-600' },
    { name: 'Twitter', key: 'twitter', color: 'bg-sky-500' },
    { name: 'LinkedIn', key: 'linkedin', color: 'bg-blue-700' },
    { name: 'Google Search', key: 'google', color: 'bg-green-600' },
    { name: 'Instagram', key: 'instagram', color: 'bg-pink-600' },
    { name: 'Tumblr', key: 'tumblr', color: 'bg-blue-400' },
    { name: 'Mastodon', key: 'mastodon', color: 'bg-purple-600' },
    { name: 'Nextdoor', key: 'nextdoor', color: 'bg-green-500' },
    { name: 'Bluesky', key: 'bluesky', color: 'bg-blue-500' }
  ];

  const codeExamples = [
    {
      title: 'Basic Usage',
      description: 'Get preview data for a URL with default platforms',
      code: `curl "https://social-preview-generator.com/preview?url=https://example.com"`,
      language: 'bash'
    },
    {
      title: 'Specific Platforms',
      description: 'Get preview data for specific social platforms',
      code: `curl "https://social-preview-generator.com/preview?url=https://example.com&platforms=facebook,twitter,linkedin"`,
      language: 'bash'
    },
    {
      title: 'JavaScript Fetch',
      description: 'Use the API in your JavaScript applications',
      code: `const response = await fetch('/preview?url=https://example.com&platforms=facebook,twitter');
const data = await response.json();
console.log(data);`,
      language: 'javascript'
    },
    {
      title: 'Python Requests',
      description: 'Use the API in your Python applications',
      code: `import requests

response = requests.get('https://social-preview-generator.com/preview', params={
    'url': 'https://example.com',
    'platforms': 'facebook,twitter,linkedin'
})
data = response.json()
print(data)`,
      language: 'python'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-full">
              <Code className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">API Documentation</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Integrate social media preview generation into your applications with our free REST API. 
            No authentication required, completely free for everyone.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-blue-100 rounded-full p-2 mr-3">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* API Endpoint */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">API Endpoint</h2>
          <div className="bg-gray-900 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between">
              <code className="text-green-400 font-mono text-sm">
                GET /preview
              </code>
              <button
                onClick={() => copyToClipboard('/preview', 'endpoint')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {copied === 'endpoint' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <p className="text-gray-600 mb-4">
            The main API endpoint for generating social media previews. Returns metadata, iframe URLs, and platform-specific data.
          </p>
        </div>

        {/* Parameters */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Parameters</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">url (required)</h3>
              <p className="text-gray-600 mb-2">The URL you want to generate previews for.</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">string</code>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">platforms (optional)</h3>
              <p className="text-gray-600 mb-2">Comma-separated list of platforms to generate previews for.</p>
              <p className="text-gray-500 text-sm mb-2">Default: facebook,twitter,linkedin,google</p>
              <p className="text-gray-500 text-sm mb-2">Available: facebook, twitter, linkedin, google, instagram, tumblr, mastodon, nextdoor, bluesky</p>
              <code className="bg-gray-100 px-2 py-1 rounded text-sm">string</code>
            </div>
          </div>
        </div>

        {/* Supported Platforms */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Supported Platforms</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {platforms.map((platform) => (
              <div key={platform.key} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className={`w-3 h-3 rounded-full ${platform.color} mr-3`}></div>
                <span className="text-gray-900 font-medium">{platform.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Examples */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Examples</h2>
          <div className="space-y-6">
            {codeExamples.map((example, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{example.title}</h3>
                  <p className="text-gray-600 text-sm">{example.description}</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 uppercase tracking-wide">{example.language}</span>
                    <button
                      onClick={() => copyToClipboard(example.code, `example-${index}`)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copied === `example-${index}` ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{example.code}</code>
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response Format */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Response Format</h2>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-green-400 font-mono text-sm">JSON Response</span>
              <button
                onClick={() => copyToClipboard(`{
  "success": true,
  "url": "https://example.com",
  "metadata": {
    "title": "Example Page",
    "description": "This is an example page",
    "image": "https://example.com/image.jpg",
    "siteName": "Example Site",
    "author": "John Doe"
  },
  "missingData": ["image"],
  "iframeUrls": {
    "facebook": "https://social-preview-generator.com/facebook-social-preview?url=https://example.com",
    "twitter": "https://social-preview-generator.com/twitter-social-preview?url=https://example.com"
  },
  "previewData": {
    "facebook": {
      "title": "Example Page",
      "description": "This is an example page",
      "ogTitle": "Example Page",
      "ogDescription": "This is an example page",
      "ogImage": "https://example.com/image.jpg"
    }
  }
}`, 'response')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {copied === 'response' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{`{
  "success": true,
  "url": "https://example.com",
  "metadata": {
    "title": "Example Page",
    "description": "This is an example page",
    "image": "https://example.com/image.jpg",
    "siteName": "Example Site",
    "author": "John Doe"
  },
  "missingData": ["image"],
  "iframeUrls": {
    "facebook": "https://social-preview-generator.com/facebook-social-preview?url=https://example.com",
    "twitter": "https://social-preview-generator.com/twitter-social-preview?url=https://example.com"
  },
  "previewData": {
    "facebook": {
      "title": "Example Page",
      "description": "This is an example page",
      "ogTitle": "Example Page",
      "ogDescription": "This is an example page",
      "ogImage": "https://example.com/image.jpg"
    }
  }
}`}</code>
            </pre>
          </div>
        </div>

        {/* Test API */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Test the API</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Test URL</label>
              <input
                type="url"
                value={testUrl}
                onChange={(e) => setTestUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={testApi}
              disabled={isTesting}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isTesting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Testing...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Test API
                </>
              )}
            </button>
            {testResult && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Response</h3>
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
                  <code>{testResult}</code>
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Error Handling */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Error Handling</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900">400 Bad Request</h3>
              <p className="text-gray-600">Missing required URL parameter</p>
              <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
                <code>{`{
  "error": "URL parameter is required",
  "example": "/preview?url=https://example.com&platforms=facebook,twitter"
}`}</code>
              </pre>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900">500 Internal Server Error</h3>
              <p className="text-gray-600">Failed to fetch or process the URL</p>
              <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
                <code>{`{
  "error": "Failed to generate preview",
  "details": "Error message here"
}`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Rate Limits */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Rate Limits</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <Shield className="h-5 w-5 text-blue-600 mr-2" />
              <p className="text-blue-800">
                Currently, there are no rate limits on the API. However, we reserve the right to implement rate limiting 
                if necessary to ensure fair usage for all users.
              </p>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Link 
              href="/bulk"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-3">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Bulk Processing</h3>
              </div>
              <p className="text-gray-600">Process multiple URLs at once with our bulk processing tool.</p>
            </Link>
            <Link 
              href="/ai"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-3">
                <Zap className="h-6 w-6 text-purple-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">AI Enhancement</h3>
              </div>
              <p className="text-gray-600">Enhance your social media previews with AI-powered optimization.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 