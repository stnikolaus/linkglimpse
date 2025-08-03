'use client';

import { useState, useRef } from 'react';
import { 
  Upload, 
  Download, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X, 
  Loader2,
  BarChart3,
  Clock,
  Globe,
  Settings
} from 'lucide-react';

interface BulkResult {
  url: string;
  success: boolean;
  metadata?: {
    title?: string;
    description?: string;
    image?: string;
    siteName?: string;
    author?: string;
  };
  error?: string;
  processingTime: number;
}

interface BulkSummary {
  totalUrls: number;
  successful: number;
  failed: number;
  totalProcessingTime: number;
  averageProcessingTime: number;
}

export default function BulkProcessor() {
  const [urls, setUrls] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BulkResult[]>([]);
  const [summary, setSummary] = useState<BulkSummary | null>(null);
  const [progress, setProgress] = useState(0);
  const [exportFormat, setExportFormat] = useState<'json' | 'csv'>('json');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['facebook', 'twitter', 'linkedin', 'google']);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const platforms = [
    { key: 'facebook', label: 'Facebook', color: 'bg-blue-600' },
    { key: 'twitter', label: 'Twitter', color: 'bg-sky-500' },
    { key: 'linkedin', label: 'LinkedIn', color: 'bg-blue-700' },
    { key: 'google', label: 'Google Search', color: 'bg-green-600' },
    { key: 'instagram', label: 'Instagram', color: 'bg-pink-600' },
    { key: 'tumblr', label: 'Tumblr', color: 'bg-blue-400' },
    { key: 'mastodon', label: 'Mastodon', color: 'bg-purple-600' },
    { key: 'nextdoor', label: 'Nextdoor', color: 'bg-green-500' },
    { key: 'bluesky', label: 'Bluesky', color: 'bg-blue-500' }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const lines = content.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0)
        .slice(0, 100); // Limit to 100 URLs
      
      setUrls(lines);
    };
    reader.readAsText(file);
  };

  const handleUrlInput = (value: string) => {
    const urlList = value.split('\n')
      .map(url => url.trim())
      .filter(url => url.length > 0)
      .slice(0, 100);
    setUrls(urlList);
  };

  const processBulkUrls = async () => {
    if (urls.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setResults([]);
    setSummary(null);

    try {
      const response = await fetch('/api/bulk', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urls,
          platforms: selectedPlatforms,
          format: exportFormat
        })
      });

      if (exportFormat === 'csv') {
        // Handle CSV download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bulk-social-previews-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        
        setIsProcessing(false);
        return;
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setResults(data.results);
      setSummary(data.summary);
      setProgress(100);
    } catch (error) {
      console.error('Bulk processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const exportResults = () => {
    if (results.length === 0) return;

    if (exportFormat === 'json') {
      const dataStr = JSON.stringify({ results, summary }, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = window.URL.createObjectURL(dataBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulk-social-previews-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setUrls([]);
    setResults([]);
    setSummary(null);
    setProgress(0);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-full shadow-lg">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Bulk URL Processor</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Process multiple URLs at once and export results in JSON or CSV format. 
          Perfect for marketers and SEO professionals.
        </p>
      </div>

      {/* Configuration Panel */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Settings className="h-5 w-5 text-gray-600 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Platform Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Platforms
            </label>
            <div className="grid grid-cols-2 gap-2">
              {platforms.map((platform) => (
                <label key={platform.key} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedPlatforms.includes(platform.key)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedPlatforms([...selectedPlatforms, platform.key]);
                      } else {
                        setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.key));
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{platform.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Export Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Export Format
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">JSON (Detailed results)</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  checked={exportFormat === 'csv'}
                  onChange={() => setExportFormat('csv')}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">CSV (Spreadsheet format)</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* URL Input Section */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Globe className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">URL Input</h3>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              <Upload className="h-4 w-4 mr-1" />
              Upload File
            </button>
            <button
              onClick={clearAll}
              className="flex items-center px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt,.csv"
          onChange={handleFileUpload}
          className="hidden"
        />

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URLs (one per line, max 100)
            </label>
            <textarea
              value={urls.join('\n')}
              onChange={(e) => handleUrlInput(e.target.value)}
              placeholder="https://example.com&#10;https://google.com&#10;https://github.com"
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{urls.length} URLs ready to process</span>
            <span>Max 100 URLs per batch</span>
          </div>

          <button
            onClick={processBulkUrls}
            disabled={isProcessing || urls.length === 0}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Processing... ({progress}%)
              </>
            ) : (
              <>
                <BarChart3 className="h-5 w-5 mr-2" />
                Process {urls.length} URLs
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Section */}
      {summary && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Results Summary</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{summary.totalUrls}</div>
              <div className="text-sm text-gray-600">Total URLs</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">{summary.successful}</div>
              <div className="text-sm text-gray-600">Successful</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-600">{summary.failed}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">{summary.totalProcessingTime}ms</div>
              <div className="text-sm text-gray-600">Total Time</div>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={exportResults}
              className="flex items-center px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="h-4 w-4 mr-2" />
              Export {exportFormat.toUpperCase()}
            </button>
          </div>
        </div>
      )}

      {/* Detailed Results */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center mb-4">
            <FileText className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Detailed Results</h3>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600 mr-2" />
                      )}
                      <span className="font-medium text-gray-900 truncate">{result.url}</span>
                      <button
                        onClick={() => removeUrl(index)}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    
                    {result.success && result.metadata && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Title:</span>
                          <p className="text-gray-600 truncate">{result.metadata.title || 'Not found'}</p>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Description:</span>
                          <p className="text-gray-600 truncate">{result.metadata.description || 'Not found'}</p>
                        </div>
                      </div>
                    )}
                    
                    {!result.success && result.error && (
                      <div className="text-sm text-red-600">{result.error}</div>
                    )}
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 ml-4">
                    <Clock className="h-4 w-4 mr-1" />
                    {result.processingTime}ms
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 