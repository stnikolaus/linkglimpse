'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckCircle, Copy } from 'lucide-react';

interface CodeExample {
  title: string;
  code: string;
  language: string;
}

interface CodeExamplesProps {
  examples: CodeExample[];
}

export default function CodeExamples({ examples }: CodeExamplesProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>(examples[0]?.language || 'javascript');
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const currentExample = examples.find(example => example.language === selectedLanguage) || examples[0];

  const languageOptions = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'php', label: 'PHP' },
    { value: 'bash', label: 'cURL' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'go', label: 'Go' },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Code Examples</h2>
      
      {/* Language Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Select Programming Language
        </label>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map((option) => {
            const hasExample = examples.some(example => example.language === option.value);
            return (
              <button
                key={option.value}
                onClick={() => setSelectedLanguage(option.value)}
                disabled={!hasExample}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedLanguage === option.value
                    ? 'bg-gray-950 text-white'
                    : hasExample
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-gray-50 text-gray-400 cursor-not-allowed'
                }`}
              >
                {option.label}
                {!hasExample && <span className="ml-1 text-xs">(Coming Soon)</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Code Display */}
      {currentExample && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">{currentExample.title}</h3>
            <button
              onClick={() => copyToClipboard(currentExample.code, 'code-example')}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
              title="Copy code"
            >
              {copied === 'code-example' ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          <div className="relative">
            <SyntaxHighlighter
              language={currentExample.language}
              style={tomorrow}
              customStyle={{
                margin: 0,
                borderRadius: 0,
                fontSize: '14px',
                lineHeight: '1.5',
              }}
              showLineNumbers={true}
              wrapLines={true}
            >
              {currentExample.code}
            </SyntaxHighlighter>
          </div>
        </div>
      )}

      {/* Additional Examples Info */}
      <div className="mt-4 text-sm text-gray-600">
        <p>
          💡 <strong>Tip:</strong> Click on any language above to see the code example in your preferred programming language. 
          More languages coming soon!
        </p>
      </div>
    </div>
  );
}
