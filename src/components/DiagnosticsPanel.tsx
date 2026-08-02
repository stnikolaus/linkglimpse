'use client';

import { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clipboard,
  Download,
  FileCode2,
  ShieldAlert,
  XCircle,
} from 'lucide-react';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';
import type { ApiResponse, DiagnosticStatus } from '@/types';

interface DiagnosticsPanelProps {
  metadata: ApiResponse;
}

const statusStyles: Record<DiagnosticStatus, { icon: typeof CheckCircle2; className: string; label: string }> = {
  pass: { icon: CheckCircle2, className: 'text-green-700 bg-green-50 border-green-200', label: 'Pass' },
  warning: { icon: AlertTriangle, className: 'text-amber-700 bg-amber-50 border-amber-200', label: 'Review' },
  fail: { icon: XCircle, className: 'text-red-700 bg-red-50 border-red-200', label: 'Fix' },
};

function formatBytes(bytes?: number): string | undefined {
  if (!bytes) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DiagnosticsPanel({ metadata }: DiagnosticsPanelProps) {
  const [showRawTags, setShowRawTags] = useState(false);
  const [copied, setCopied] = useState(false);
  const analytics = useLinkGlimpseAnalytics();
  const diagnostics = metadata.diagnostics;

  if (!diagnostics) return null;

  const report = JSON.stringify({
    inspectedAt: new Date().toISOString(),
    requestedUrl: metadata.requestedUrl,
    finalUrl: metadata.finalUrl,
    status: metadata.status,
    contentType: metadata.contentType,
    canonical: metadata.canonical,
    robots: metadata.robots,
    image: metadata.imageInfo,
    diagnostics,
    tags: metadata.tags,
  }, null, 2);

  const copyReport = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    analytics.trackReportExported('clipboard', diagnostics.score);
    window.setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    const blob = new Blob([report], { type: 'application/json' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `linkglimpse-report-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(href);
    analytics.trackReportExported('json', diagnostics.score);
  };

  const imageDetails = [
    metadata.imageInfo?.width && metadata.imageInfo.height
      ? `${metadata.imageInfo.width}×${metadata.imageInfo.height}`
      : undefined,
    metadata.imageInfo?.contentType,
    formatBytes(metadata.imageInfo?.contentLength),
  ].filter(Boolean).join(' · ');

  return (
    <section className="max-w-7xl mx-auto px-4 mb-10" aria-labelledby="diagnostics-heading">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center border-4 font-bold text-xl ${
                diagnostics.score >= 80
                  ? 'border-green-200 text-green-700 bg-green-50'
                  : diagnostics.score >= 55
                    ? 'border-amber-200 text-amber-700 bg-amber-50'
                    : 'border-red-200 text-red-700 bg-red-50'
              }`}>
                {diagnostics.score}
              </div>
              <div>
                <h2 id="diagnostics-heading" className="text-2xl font-bold text-gray-900">Metadata diagnostics</h2>
                <p className="text-gray-600 mt-1">
                  {diagnostics.counts.pass} passed · {diagnostics.counts.warning} to review · {diagnostics.counts.fail} to fix
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyReport}
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-white"
              >
                <Clipboard className="h-4 w-4" />
                {copied ? 'Copied' : 'Copy report'}
              </button>
              <button
                type="button"
                onClick={downloadReport}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700"
              >
                <Download className="h-4 w-4" />
                Download JSON
              </button>
            </div>
          </div>

          <dl className="grid md:grid-cols-2 xl:grid-cols-4 gap-3 mt-6 text-sm">
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <dt className="text-gray-500">HTTP response</dt>
              <dd className="font-semibold text-gray-900 mt-1">{metadata.status} {metadata.statusText}</dd>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <dt className="text-gray-500">Final URL</dt>
              <dd className="font-semibold text-gray-900 mt-1 truncate" title={metadata.finalUrl}>{metadata.redirected ? 'Redirected' : 'Direct'}</dd>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <dt className="text-gray-500">Canonical</dt>
              <dd className="font-semibold text-gray-900 mt-1 truncate" title={metadata.canonical}>{metadata.canonical ? 'Declared' : 'Missing'}</dd>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <dt className="text-gray-500">Share image</dt>
              <dd className="font-semibold text-gray-900 mt-1 truncate" title={imageDetails}>{imageDetails || 'Not detected'}</dd>
            </div>
          </dl>
        </div>

        <div className="p-6">
          <h3 className="font-semibold text-gray-900 mb-3">Platform readiness</h3>
          <div className="grid md:grid-cols-3 gap-3 mb-8">
            {diagnostics.platforms.map((platform) => (
              <div key={platform.platform} className={`border rounded-lg p-4 ${
                platform.status === 'ready' ? 'border-green-200 bg-green-50' : 'border-amber-200 bg-amber-50'
              }`}>
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  {platform.status === 'ready' ? <CheckCircle2 className="h-5 w-5 text-green-700" /> : <ShieldAlert className="h-5 w-5 text-amber-700" />}
                  {platform.platform}
                </div>
                <p className="text-sm text-gray-700 mt-2">
                  {platform.status === 'ready' ? 'Core tags are ready.' : `Missing: ${platform.missing.join(', ')}`}
                </p>
              </div>
            ))}
          </div>

          <h3 className="font-semibold text-gray-900 mb-3">Actionable checks</h3>
          <div className="grid lg:grid-cols-2 gap-3">
            {diagnostics.checks.map((check) => {
              const config = statusStyles[check.status];
              const Icon = config.icon;
              return (
                <div key={check.id} className={`border rounded-lg p-4 ${config.className}`}>
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{check.label}</h4>
                        <span className="text-xs font-medium uppercase tracking-wide">{config.label}</span>
                      </div>
                      {check.value && <p className="text-sm text-gray-700 mt-1 truncate" title={check.value}>{check.value}</p>}
                      {check.status !== 'pass' && <p className="text-sm text-gray-700 mt-2">{check.recommendation}</p>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={() => setShowRawTags((current) => !current)}
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800"
              aria-expanded={showRawTags}
            >
              <FileCode2 className="h-4 w-4" />
              {showRawTags ? 'Hide extracted tags' : `Inspect raw tags (${Object.keys(metadata.tags ?? {}).length})`}
            </button>
            {showRawTags && (
              <pre className="mt-3 p-4 bg-gray-950 text-green-300 rounded-lg overflow-x-auto text-xs leading-relaxed">
                {JSON.stringify(metadata.tags ?? {}, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
