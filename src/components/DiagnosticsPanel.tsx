'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import {
  AlertTriangle,
  Bot,
  CheckCircle2,
  Clock3,
  Copy,
  FileCode2,
  Link2,
  ShieldAlert,
  Terminal,
  XCircle,
} from 'lucide-react';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';
import type { ApiResponse, DiagnosticStatus } from '@/types';
import {
  buildAiAgentPrompt,
  buildApiCommand,
  getRemediationCode,
  platformCacheGuidance,
} from '@/lib/report-actions';

interface DiagnosticsPanelProps {
  metadata: ApiResponse;
  preview?: ReactNode;
  previewTitle?: string;
}

interface HistoryEntry {
  capturedAt: string;
  score: number;
  title?: string;
  description?: string;
  image?: string;
  canonical?: string;
  finalUrl?: string;
  fingerprint: string;
}

const statusStyles: Record<DiagnosticStatus, {
  icon: typeof CheckCircle2;
  accentClassName: string;
  iconClassName: string;
  labelClassName: string;
  label: string;
}> = {
  pass: {
    icon: CheckCircle2,
    accentClassName: 'border-l-emerald-500',
    iconClassName: 'text-emerald-600',
    labelClassName: 'bg-emerald-50 text-emerald-700',
    label: 'Pass',
  },
  warning: {
    icon: AlertTriangle,
    accentClassName: 'border-l-amber-500',
    iconClassName: 'text-amber-600',
    labelClassName: 'bg-amber-50 text-amber-800',
    label: 'Review',
  },
  fail: {
    icon: XCircle,
    accentClassName: 'border-l-red-500',
    iconClassName: 'text-red-600',
    labelClassName: 'bg-red-50 text-red-700',
    label: 'Fix',
  },
};

function formatBytes(bytes?: number): string | undefined {
  if (!bytes) return undefined;
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DiagnosticsPanel({
  metadata,
  preview,
  previewTitle = 'Link preview',
}: DiagnosticsPanelProps) {
  const [showRawTags, setShowRawTags] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const analytics = useLinkGlimpseAnalytics();
  const diagnostics = metadata.diagnostics;
  const historyUrl = metadata.requestedUrl || metadata.url;
  const historyScore = diagnostics?.score;
  const historyFingerprint = JSON.stringify({
    status: metadata.status,
    finalUrl: metadata.finalUrl,
    canonical: metadata.canonical,
    title: metadata.title,
    description: metadata.description,
    image: metadata.image,
    tags: metadata.tags,
    score: historyScore,
  });

  useEffect(() => {
    if (historyScore === undefined) return;

    const storageKey = `linkglimpse:metadata-history:v1:${historyUrl}`;

    try {
      const stored = JSON.parse(window.localStorage.getItem(storageKey) || '[]') as HistoryEntry[];
      setHistory(stored.filter((entry) => entry.fingerprint !== historyFingerprint).slice(0, 4));

      if (stored[0]?.fingerprint !== historyFingerprint) {
        const current: HistoryEntry = {
          capturedAt: new Date().toISOString(),
          score: historyScore,
          title: metadata.title,
          description: metadata.description,
          image: metadata.image,
          canonical: metadata.canonical,
          finalUrl: metadata.finalUrl,
          fingerprint: historyFingerprint,
        };
        window.localStorage.setItem(storageKey, JSON.stringify([current, ...stored].slice(0, 5)));
      }
    } catch {
      setHistory([]);
    }
  }, [
    historyFingerprint,
    historyScore,
    historyUrl,
    metadata.canonical,
    metadata.description,
    metadata.finalUrl,
    metadata.image,
    metadata.title,
  ]);

  if (!diagnostics) return null;

  const copyText = async (key: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(key);
    window.setTimeout(() => setCopied((current) => current === key ? null : current), 2000);
  };

  const copyAiPrompt = async () => {
    await copyText('ai-prompt', buildAiAgentPrompt(metadata));
    analytics.trackAiPromptCopied(diagnostics.counts.warning + diagnostics.counts.fail, diagnostics.score);
  };

  const copyShareLink = async () => {
    const targetUrl = metadata.requestedUrl || metadata.finalUrl || metadata.url;
    const shareUrl = `${window.location.origin}/report?url=${encodeURIComponent(targetUrl)}`;
    await copyText('share', shareUrl);
    analytics.trackReportShared(diagnostics.score);
  };

  const copyApiCommand = async () => {
    await copyText('api-command', buildApiCommand(metadata));
    analytics.trackReportExported('api-command', diagnostics.score);
  };

  const imageDetails = [
    metadata.imageInfo?.width && metadata.imageInfo.height
      ? `${metadata.imageInfo.width}×${metadata.imageInfo.height}`
      : undefined,
    metadata.imageInfo?.contentType,
    formatBytes(metadata.imageInfo?.contentLength),
  ].filter(Boolean).join(' · ');
  const scoreStyles = diagnostics.score >= 80
    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
    : diagnostics.score >= 55
      ? 'border-amber-200 bg-amber-50 text-amber-800'
      : 'border-red-200 bg-red-50 text-red-700';
  const httpStatusClassName = metadata.status !== undefined && metadata.status >= 200 && metadata.status < 300
    ? 'text-emerald-700'
    : metadata.status !== undefined && metadata.status >= 400
      ? 'text-red-700'
      : 'text-amber-700';
  const hasIssues = diagnostics.counts.warning + diagnostics.counts.fail > 0;

  return (
    <section className="w-full mb-10" aria-labelledby="diagnostics-heading">
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className={`grid border-b border-gray-200 ${
          preview ? 'xl:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.1fr)]' : ''
        }`}>
          <div className={`min-w-0 ${preview ? 'xl:border-r xl:border-gray-200' : ''}`}>
            <div className="p-6 border-b border-gray-200 bg-white">
              <div className={`flex gap-5 ${
                preview
                  ? 'flex-col items-start'
                  : 'flex-col lg:flex-row lg:items-center lg:justify-between'
              }`}>
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 shrink-0 rounded-full flex items-center justify-center border-2 font-bold text-lg ${scoreStyles}`}>
                    {diagnostics.score}
                  </div>
                  <div>
                    <h2 id="diagnostics-heading" className="text-xl font-bold text-gray-900">Metadata diagnostics</h2>
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium text-emerald-700">{diagnostics.counts.pass} passed</span>
                      <span aria-hidden="true"> · </span>
                      <span className={diagnostics.counts.warning ? 'font-medium text-amber-700' : 'text-gray-500'}>{diagnostics.counts.warning} to review</span>
                      <span aria-hidden="true"> · </span>
                      <span className={diagnostics.counts.fail ? 'font-medium text-red-700' : 'text-gray-500'}>{diagnostics.counts.fail} to fix</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {hasIssues && (
                    <button
                      type="button"
                      onClick={copyAiPrompt}
                      className="inline-flex items-center gap-2 px-3 py-2 bg-gray-950 border border-gray-950 rounded-md text-sm font-medium text-white hover:bg-gray-800"
                    >
                      <Bot className="h-4 w-4" />
                      {copied === 'ai-prompt' ? 'AI prompt copied' : 'Copy fixes for AI'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={copyShareLink}
                    className="inline-flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-800 hover:bg-gray-50"
                  >
                    <Link2 className="h-4 w-4" />
                    {copied === 'share' ? 'Link copied' : 'Copy result link'}
                  </button>
                </div>
              </div>
            </div>

            <dl className={`grid gap-3 p-6 text-sm ${
              preview ? '' : 'md:grid-cols-2 xl:grid-cols-4'
            }`}>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <dt className="text-gray-500">HTTP response</dt>
                <dd className={`font-semibold mt-1 ${httpStatusClassName}`}>{metadata.status ?? 'Unknown'} {metadata.statusText}</dd>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <dt className="text-gray-500">Final URL</dt>
                <dd className={`font-semibold mt-1 truncate ${metadata.redirected ? 'text-amber-700' : 'text-emerald-700'}`} title={metadata.finalUrl}>{metadata.redirected ? 'Redirected' : 'Direct'}</dd>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <dt className="text-gray-500">Canonical</dt>
                <dd className={`font-semibold mt-1 truncate ${metadata.canonical ? 'text-emerald-700' : 'text-red-700'}`} title={metadata.canonical}>{metadata.canonical ? 'Declared' : 'Missing'}</dd>
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-3">
                <dt className="text-gray-500">Share image</dt>
                <dd className={`font-semibold mt-1 truncate ${imageDetails ? 'text-emerald-700' : 'text-red-700'}`} title={imageDetails}>{imageDetails || 'Not detected'}</dd>
              </div>
            </dl>
          </div>

          {preview && (
            <div className="min-w-0 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">{previewTitle}</h3>
              <div className="min-w-0 overflow-hidden rounded-lg border border-gray-200 bg-white p-4">
                {preview}
              </div>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="min-w-0">
            <h3 className="font-semibold text-gray-900 mb-3">Platform readiness</h3>
            <div className="grid md:grid-cols-3 gap-3 mb-8">
              {diagnostics.platforms.map((platform) => (
                <div key={platform.platform} className="border border-gray-200 rounded-lg bg-white p-4">
                  <div className="flex items-center gap-2 font-semibold text-gray-900">
                    {platform.status === 'ready' ? <CheckCircle2 className="h-5 w-5 text-emerald-600" /> : <ShieldAlert className="h-5 w-5 text-amber-600" />}
                    {platform.platform}
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-xs font-medium ${platform.status === 'ready' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                      {platform.status === 'ready' ? 'Ready' : 'Review'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">
                    {platform.status === 'ready' ? 'Core tags are ready.' : `Missing: ${platform.missing.join(', ')}`}
                  </p>
                </div>
              ))}
            </div>

            <h3 className="font-semibold text-gray-900 mb-3">Actionable checks</h3>
            <div className="grid gap-3 lg:grid-cols-2">
              {diagnostics.checks.map((check) => {
                const config = statusStyles[check.status];
                const Icon = config.icon;
                return (
                  <div key={check.id} className={`rounded-lg border border-l-4 border-gray-200 bg-white p-4 ${config.accentClassName}`}>
                    <div className="flex items-start gap-3">
                      <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${config.iconClassName}`} />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">{check.label}</h4>
                          <span className={`rounded-full px-2 py-0.5 text-xs font-medium uppercase tracking-wide ${config.labelClassName}`}>{config.label}</span>
                        </div>
                        {check.value && <p className="text-sm text-gray-700 mt-1 truncate" title={check.value}>{check.value}</p>}
                        {check.status !== 'pass' && <p className="text-sm text-gray-700 mt-2">{check.recommendation}</p>}
                        {check.status !== 'pass' && (
                          <button
                            type="button"
                            onClick={async () => {
                              await copyText(`fix-${check.id}`, getRemediationCode(check, metadata));
                              analytics.trackRemediationCopied(check.id, check.status);
                            }}
                            className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-gray-800 hover:text-black"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            {copied === `fix-${check.id}` ? 'Fix copied' : 'Copy suggested fix'}
                          </button>
                        )}
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
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-900"
                aria-expanded={showRawTags}
              >
                <FileCode2 className="h-4 w-4" />
                {showRawTags ? 'Hide extracted tags' : `Inspect raw tags (${Object.keys(metadata.tags ?? {}).length})`}
              </button>
              {showRawTags && (
                <pre className="mt-3 p-4 bg-gray-950 text-gray-100 rounded-lg overflow-x-auto text-xs leading-relaxed">
                  {JSON.stringify(metadata.tags ?? {}, null, 2)}
                </pre>
              )}
            </div>

            <div className="grid gap-6 mt-8 xl:grid-cols-2">
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Redirect trace</h3>
                <ol className="rounded-lg border border-gray-200 divide-y divide-gray-200 overflow-hidden">
                  {(metadata.redirectChain?.length ? metadata.redirectChain : [{
                    url: metadata.finalUrl || metadata.url,
                    status: metadata.status || 0,
                    statusText: metadata.statusText,
                  }]).map((hop, index) => (
                    <li key={`${hop.url}-${index}`} className="p-3 bg-white text-sm">
                      <div className="flex items-center justify-between gap-3">
                        <span className="font-medium text-gray-900">Hop {index + 1}</span>
                        <span className="text-gray-600">{hop.status || 'Unknown'} {hop.statusText}</span>
                      </div>
                      <p className="text-gray-600 truncate mt-1" title={hop.url}>{hop.url}</p>
                      {hop.location && <p className="text-xs text-gray-700 truncate mt-1" title={hop.location}>→ {hop.location}</p>}
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Metadata history <span className="font-normal text-gray-500">(this browser)</span></h3>
                {history.length > 0 ? (
                  <ol className="rounded-lg border border-gray-200 divide-y divide-gray-200 overflow-hidden">
                    {history.slice(0, 3).map((entry) => {
                      const changes = getHistoryChanges(entry, metadata);
                      return (
                        <li key={`${entry.capturedAt}-${entry.fingerprint}`} className="p-3 bg-white text-sm">
                          <div className="flex items-center justify-between gap-3">
                            <span className="inline-flex items-center gap-1.5 text-gray-600"><Clock3 className="h-3.5 w-3.5" /> {new Date(entry.capturedAt).toLocaleString()}</span>
                            <span className="font-semibold text-gray-900">{entry.score} → {diagnostics.score}</span>
                          </div>
                          <p className="text-gray-600 mt-1">{changes.length ? `Changed: ${changes.join(', ')}` : 'No core metadata changes.'}</p>
                        </li>
                      );
                    })}
                  </ol>
                ) : (
                  <div className="rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-600">
                    Recheck this URL after a deployment to compare its score and core metadata here.
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="font-semibold text-gray-900 mb-3">Refresh platform caches after deployment</h3>
              <div className="grid md:grid-cols-3 gap-3">
                {platformCacheGuidance.map((item) => (
                  <article key={item.platform} className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <h4 className="font-semibold text-gray-900">{item.platform}</h4>
                    <p className="text-sm text-gray-600 mt-2">{item.steps}</p>
                    <a className="inline-flex mt-3 text-sm font-medium text-gray-900 underline decoration-gray-300 underline-offset-4 hover:decoration-gray-900" href={item.href} target="_blank" rel="noreferrer">
                      Open official resource ↗
                    </a>
                  </article>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-lg border border-gray-200 bg-gray-950 p-4 text-white">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h3 className="inline-flex items-center gap-2 font-semibold"><Terminal className="h-4 w-4" /> Re-run through the API</h3>
                  <p className="text-sm text-gray-300 mt-1">Use the same live inspection in a terminal, CI job, or release checklist.</p>
                </div>
                <button type="button" onClick={copyApiCommand} className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-white text-gray-950 text-sm font-semibold hover:bg-gray-100">
                  <Copy className="h-4 w-4" />
                  {copied === 'api-command' ? 'Command copied' : 'Copy curl command'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function getHistoryChanges(previous: HistoryEntry, current: ApiResponse): string[] {
  const fields: Array<[string, string | undefined, string | undefined]> = [
    ['title', previous.title, current.title],
    ['description', previous.description, current.description],
    ['image', previous.image, current.image],
    ['canonical', previous.canonical, current.canonical],
    ['final URL', previous.finalUrl, current.finalUrl],
  ];

  return fields.filter(([, before, after]) => before !== after).map(([label]) => label);
}
