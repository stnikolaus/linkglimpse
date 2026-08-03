'use client';

import { usePlausible } from 'next-plausible';
import { capturePostHog } from '@/lib/posthog-client';

type AnalyticsValue = string | number | boolean;
type AnalyticsProps = Record<string, AnalyticsValue | undefined>;

export const PRODUCT_EVENTS = {
  previewStarted: 'Preview Started',
  previewSucceeded: 'Preview Succeeded',
  previewFailed: 'Preview Failed',
  reportExported: 'Report Exported',
  reportShared: 'Report Shared',
  remediationCopied: 'Remediation Copied',
  aiPromptCopied: 'AI Prompt Copied',
  comparisonCompleted: 'Comparison Completed',
  bulkProcessingStarted: 'Bulk Processing Started',
  bulkProcessingSucceeded: 'Bulk Processing Succeeded',
  bulkReportExported: 'Bulk Report Exported',
  apiTestCompleted: 'API Test Completed',
  platformNavigation: 'Platform Navigation',
  distributionClicked: 'Distribution Link Clicked',
} as const;

function getHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'invalid';
  }
}

function cleanProps(props: AnalyticsProps): Record<string, AnalyticsValue> {
  return Object.fromEntries(
    Object.entries(props).filter((entry): entry is [string, AnalyticsValue] => entry[1] !== undefined),
  );
}

export function useLinkGlimpseAnalytics() {
  const plausible = usePlausible();
  const capture = (event: string, props: AnalyticsProps = {}) => {
    const cleaned = cleanProps(props);
    plausible(event, { props: cleaned });

    if (process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN) {
      capturePostHog(event, cleaned);
    }
  };

  return {
    trackPreviewStarted: (surface: string, url: string) => capture(PRODUCT_EVENTS.previewStarted, {
      surface,
      url_domain: getHostname(url),
    }),
    trackPreviewSucceeded: (surface: string, metadata: { url: string; diagnostics?: { score: number }; redirected?: boolean }, durationMs: number) => capture(PRODUCT_EVENTS.previewSucceeded, {
      surface,
      url_domain: getHostname(metadata.url),
      diagnostic_score: metadata.diagnostics?.score,
      redirected: metadata.redirected ?? false,
      duration_ms: durationMs,
    }),
    trackPreviewFailed: (surface: string, url: string, reason: string) => capture(PRODUCT_EVENTS.previewFailed, {
      surface,
      url_domain: getHostname(url),
      reason: reason.slice(0, 120),
    }),
    trackReportExported: (format: 'json' | 'clipboard' | 'api-command', score?: number) => capture(PRODUCT_EVENTS.reportExported, {
      format,
      diagnostic_score: score,
    }),
    trackReportShared: (score?: number) => capture(PRODUCT_EVENTS.reportShared, {
      diagnostic_score: score,
    }),
    trackRemediationCopied: (checkId: string, status: string) => capture(PRODUCT_EVENTS.remediationCopied, {
      check_id: checkId,
      status,
    }),
    trackAiPromptCopied: (issueCount: number, score?: number) => capture(PRODUCT_EVENTS.aiPromptCopied, {
      issue_count: issueCount,
      diagnostic_score: score,
    }),
    trackComparisonCompleted: (scoreDelta: number) => capture(PRODUCT_EVENTS.comparisonCompleted, {
      score_delta: scoreDelta,
    }),
    trackBulkProcessingStarted: (urlCount: number) => capture(PRODUCT_EVENTS.bulkProcessingStarted, {
      url_count: urlCount,
    }),
    trackBulkProcessingSucceeded: (urlCount: number, successfulCount: number) => capture(PRODUCT_EVENTS.bulkProcessingSucceeded, {
      url_count: urlCount,
      successful_count: successfulCount,
      success_rate: urlCount > 0 ? Math.round((successfulCount / urlCount) * 100) : 0,
    }),
    trackBulkReportExported: (format: 'json' | 'csv', urlCount: number) => capture(PRODUCT_EVENTS.bulkReportExported, {
      format,
      url_count: urlCount,
    }),
    trackApiTestCompleted: (success: boolean) => capture(PRODUCT_EVENTS.apiTestCompleted, { success }),
    trackPlatformNavigation: (platform: string) => capture(PRODUCT_EVENTS.platformNavigation, { platform }),
    trackDistributionClicked: (channel: string, destination: string) => capture(PRODUCT_EVENTS.distributionClicked, {
      channel,
      destination,
    }),
  };
}
