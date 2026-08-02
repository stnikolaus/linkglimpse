'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Code,
  Globe,
  Zap,
  CheckCircle,
  Copy,
  Play,
  FileText,
  Shield,
  Terminal
} from 'lucide-react';
import CodeExamples from '@/components/CodeExamples';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';

export default function ApiPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const [testUrl, setTestUrl] = useState('https://example.com');
  const [testResult, setTestResult] = useState<string>('');
  const [isTesting, setIsTesting] = useState(false);
  const analytics = useLinkGlimpseAnalytics();

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
      const response = await fetch(`/api/metadata?url=${encodeURIComponent(testUrl)}`);
      const data = await response.json();

      setTestResult(JSON.stringify(data, null, 2));
      analytics.trackApiTestCompleted(response.ok && !data.error);
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Failed to test API'}`);
      analytics.trackApiTestCompleted(false);
    } finally {
      setIsTesting(false);
    }
  };

  const quickStartExamples = [
    {
      title: 'Get metadata for any URL',
      code: `curl "https://www.linkglimpse.com/api/metadata?url=https://example.com"`,
      description: 'Extract Open Graph, Twitter Cards, and meta tags'
    },
    {
      title: 'Process multiple URLs',
      code: `curl -X POST "https://www.linkglimpse.com/api/bulk" \\
  -H "Content-Type: application/json" \\
  -d '{"urls": ["https://example.com", "https://google.com"]}'`,
      description: 'Process up to 100 URLs at once'
    }
  ];

  const codeExamples = [
    {
      title: 'JavaScript (Fetch API)',
      code: `const response = await fetch('https://www.linkglimpse.com/api/metadata?url=https://example.com');
const data = await response.json();
console.log(data);`,
      language: 'javascript'
    },
    {
      title: 'Python (requests)',
      code: `import requests

response = requests.get('https://www.linkglimpse.com/api/metadata', params={
    'url': 'https://example.com'
})
data = response.json()
print(data)`,
      language: 'python'
    },
    {
      title: 'PHP (file_get_contents)',
      code: `$response = file_get_contents('https://www.linkglimpse.com/api/metadata?url=' . urlencode('https://example.com'));
$data = json_decode($response, true);
print_r($data);`,
      language: 'php'
    },
    {
      title: 'cURL (Command Line)',
      code: `curl "https://www.linkglimpse.com/api/metadata?url=https://example.com"`,
      language: 'bash'
    },
    {
      title: 'Ruby (net/http)',
      code: `require 'net/http'
require 'json'

uri = URI('https://www.linkglimpse.com/api/metadata')
params = { url: 'https://example.com' }
uri.query = URI.encode_www_form(params)

response = Net::HTTP.get_response(uri)
data = JSON.parse(response.body)
puts data`,
      language: 'ruby'
    },
    {
      title: 'Java (HttpClient)',
      code: `import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.URI;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://www.linkglimpse.com/api/metadata?url=https://example.com"))
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`,
      language: 'java'
    },
    {
      title: 'C# (.NET)',
      code: `using System;
using System.Net.Http;
using System.Threading.Tasks;

var client = new HttpClient();
var response = await client.GetAsync("https://www.linkglimpse.com/api/metadata?url=https://example.com");
var content = await response.Content.ReadAsStringAsync();
Console.WriteLine(content);`,
      language: 'csharp'
    },
    {
      title: 'Go (net/http)',
      code: `package main

import (
    "fmt"
    "io/ioutil"
    "net/http"
    "net/url"
)

func main() {
    baseURL := "https://www.linkglimpse.com/api/metadata"
    params := url.Values{}
    params.Add("url", "https://example.com")

    resp, err := http.Get(baseURL + "?" + params.Encode())
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, err := ioutil.ReadAll(resp.Body)
    if err != nil {
        panic(err)
    }

    fmt.Println(string(body))
}`,
      language: 'go'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-full shadow-lg">
              <Code className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">URL Metadata API for Open Graph</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Extract Open Graph, Twitter Card, canonical, robots and image metadata from any public URL. Test the free API and copy examples in eight languages.
          </p>
        </div>

        {/* Quick Start */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Terminal className="h-6 w-6 mr-2 text-blue-600" />
            URL Metadata API Quick Start
          </h2>
          <div className="space-y-6">
            {quickStartExamples.map((example, index) => (
              <div key={index} className="border border-gray-200 rounded-lg">
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{example.title}</h3>
                  <p className="text-gray-600 text-sm">{example.description}</p>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-500 uppercase tracking-wide">bash</span>
                    <button
                      onClick={() => copyToClipboard(example.code, `quick-${index}`)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {copied === `quick-${index}` ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
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

        {/* API Endpoints */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <Globe className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">GET /api/metadata — Inspect One URL</h3>
            </div>
            <p className="text-gray-600 mb-4">Extract metadata from any URL</p>
            <div className="bg-gray-900 rounded-lg p-3 mb-4">
              <code className="text-green-400 font-mono text-sm">
                ?url=https://example.com
              </code>
            </div>
            <button
              onClick={() => copyToClipboard('https://www.linkglimpse.com/api/metadata?url=https://example.com', 'metadata')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {copied === 'metadata' ? 'Copied!' : 'Copy URL'}
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">POST /api/bulk — Inspect Multiple URLs</h3>
            </div>
            <p className="text-gray-600 mb-4">Process multiple URLs at once</p>
            <div className="bg-gray-900 rounded-lg p-3 mb-4">
              <code className="text-green-400 font-mono text-sm">
                {"{urls: ['url1', 'url2']}"}
              </code>
            </div>
            <button
              onClick={() => copyToClipboard('https://www.linkglimpse.com/api/bulk', 'bulk')}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              {copied === 'bulk' ? 'Copied!' : 'Copy URL'}
            </button>
          </div>

        </div>

        {/* Code Examples */}
        <CodeExamples examples={codeExamples} />

        {/* Response Format */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Open Graph API Response Format</h2>
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-green-400 font-mono text-sm">JSON Response</span>
              <button
                onClick={() => copyToClipboard(`{
  "title": "Page Title",
  "description": "Page description",
  "image": "https://example.com/image.jpg",
  "url": "https://example.com",
  "siteName": "Site Name",
  "author": "Author Name"
}`, 'response')}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {copied === 'response' ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
            <pre className="text-green-400 text-sm overflow-x-auto">
              <code>{`{
  "title": "Page Title",
  "description": "Page description",
  "image": "https://example.com/image.jpg",
  "url": "https://example.com",
  "siteName": "Site Name",
  "author": "Author Name"
}`}</code>
            </pre>
          </div>
        </div>

        {/* Test API */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Test the URL Metadata API</h2>
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

        {/* Features */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-full p-2 mr-3">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Free URL Metadata API</h3>
            </div>
            <p className="text-gray-600">No authentication required. No rate limits. Completely free for everyone.</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 rounded-full p-2 mr-3">
                <Zap className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Fast Server-Side Metadata Fetching</h3>
            </div>
            <p className="text-gray-600">Built on Next.js with server-side processing for optimal performance.</p>
          </div>
        </div>

        {/* Error Handling */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Metadata API Error Handling</h2>
          <div className="grid gap-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900">400 Bad Request</h3>
              <p className="text-gray-600 mb-2">Missing required URL parameter</p>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                <code>{`{"error": "URL parameter is required"}`}</code>
              </pre>
            </div>
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900">500 Server Error</h3>
              <p className="text-gray-600 mb-2">Failed to fetch or process the URL</p>
              <pre className="bg-gray-100 p-2 rounded text-sm">
                <code>{`{"error": "Failed to fetch URL metadata"}`}</code>
              </pre>
            </div>
          </div>
        </div>

        {/* Additional Resources */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Metadata Tools</h2>
          <div className="grid gap-6">
            <Link
              href="/bulk"
              className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-3">
                <FileText className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">Bulk URL Metadata Checker</h3>
              </div>
              <p className="text-gray-600">Process multiple URLs at once with our bulk processing tool.</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
