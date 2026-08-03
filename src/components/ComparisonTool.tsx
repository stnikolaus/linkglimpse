'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight, CheckCircle2, GitCompareArrows, Loader2 } from 'lucide-react';
import type { ApiResponse } from '@/types';
import { fetchUrlMetadata, isValidUrl, normalizeUrl } from '@/lib/url-utils';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';

const comparisonFields: Array<{ label: string; getValue: (metadata: ApiResponse) => string }> = [
  { label: 'Diagnostic score', getValue: (metadata) => `${metadata.diagnostics?.score ?? 0}/100` },
  { label: 'HTTP response', getValue: (metadata) => `${metadata.status ?? 'Unknown'} ${metadata.statusText ?? ''}`.trim() },
  { label: 'Final URL', getValue: (metadata) => metadata.finalUrl || metadata.url },
  { label: 'Title', getValue: (metadata) => metadata.title || 'Missing' },
  { label: 'Description', getValue: (metadata) => metadata.description || 'Missing' },
  { label: 'Canonical', getValue: (metadata) => metadata.canonical || 'Missing' },
  { label: 'Share image', getValue: (metadata) => metadata.image || 'Missing' },
  { label: 'Redirect hops', getValue: (metadata) => String(metadata.redirectChain?.length ?? 1) },
];

export default function ComparisonTool() {
  const [beforeUrl, setBeforeUrl] = useState('');
  const [afterUrl, setAfterUrl] = useState('');
  const [before, setBefore] = useState<ApiResponse | null>(null);
  const [after, setAfter] = useState<ApiResponse | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const analytics = useLinkGlimpseAnalytics();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const normalizedBefore = normalizeUrl(beforeUrl.trim());
    const normalizedAfter = normalizeUrl(afterUrl.trim());

    if (!isValidUrl(normalizedBefore) || !isValidUrl(normalizedAfter)) {
      setError('Enter two valid public HTTP or HTTPS URLs.');
      return;
    }

    setIsLoading(true);
    setError('');
    setBefore(null);
    setAfter(null);

    try {
      const [beforeResult, afterResult] = await Promise.all([
        fetchUrlMetadata(normalizedBefore),
        fetchUrlMetadata(normalizedAfter),
      ]);
      if (beforeResult.error) throw new Error(`Before URL: ${beforeResult.error}`);
      if (afterResult.error) throw new Error(`After URL: ${afterResult.error}`);
      setBefore(beforeResult);
      setAfter(afterResult);
      analytics.trackComparisonCompleted((afterResult.diagnostics?.score ?? 0) - (beforeResult.diagnostics?.score ?? 0));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to compare these URLs.');
    } finally {
      setIsLoading(false);
    }
  };

  const changedCount = before && after
    ? comparisonFields.filter((field) => field.getValue(before) !== field.getValue(after)).length
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 pb-16">
      <form onSubmit={handleSubmit} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-semibold text-gray-800">
            Before or production URL
            <input
              value={beforeUrl}
              onChange={(event) => setBeforeUrl(event.target.value)}
              placeholder="https://production.example.com/page"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>
          <label className="block text-sm font-semibold text-gray-800">
            After or candidate URL
            <input
              value={afterUrl}
              onChange={(event) => setAfterUrl(event.target.value)}
              placeholder="https://staging.example.com/page"
              className="mt-2 block w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading || !beforeUrl.trim() || !afterUrl.trim()}
          className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GitCompareArrows className="h-5 w-5" />}
          {isLoading ? 'Comparing live metadata…' : 'Compare URLs'}
        </button>
      </form>

      {error && (
        <div className="mt-6 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {before && after && (
        <section className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg" aria-labelledby="comparison-heading">
          <div className="border-b border-gray-200 bg-gray-50 p-6">
            <h2 id="comparison-heading" className="text-2xl font-bold text-gray-900">Metadata comparison</h2>
            <p className="mt-1 text-gray-600">{changedCount} of {comparisonFields.length} core signals changed.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-white text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Signal</th>
                  <th className="px-6 py-4 font-medium">Before</th>
                  <th className="px-3 py-4"><span className="sr-only">Change</span></th>
                  <th className="px-6 py-4 font-medium">After</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {comparisonFields.map((field) => {
                  const beforeValue = field.getValue(before);
                  const afterValue = field.getValue(after);
                  const changed = beforeValue !== afterValue;
                  return (
                    <tr key={field.label} className={changed ? 'bg-blue-50/50' : 'bg-white'}>
                      <th className="px-6 py-4 font-semibold text-gray-900">{field.label}</th>
                      <td className="max-w-xs px-6 py-4 text-gray-600 break-words">{beforeValue}</td>
                      <td className="px-3 py-4 text-center">
                        {changed ? <ArrowRight className="mx-auto h-4 w-4 text-blue-600" /> : <CheckCircle2 className="mx-auto h-4 w-4 text-green-600" />}
                      </td>
                      <td className="max-w-xs px-6 py-4 font-medium text-gray-900 break-words">{afterValue}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="grid gap-4 border-t border-gray-200 bg-gray-50 p-6 sm:grid-cols-2">
            {[{ label: 'Open before report', metadata: before }, { label: 'Open after report', metadata: after }].map((item) => (
              <Link
                key={item.label}
                href={`/report?url=${encodeURIComponent(item.metadata.requestedUrl || item.metadata.url)}`}
                className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-4 py-3 font-semibold text-blue-700 hover:bg-blue-50"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
