import type { ApiResponse, MetadataCheck } from '@/types';
import {
  buildAiAgentPrompt as buildCoreAiAgentPrompt,
  getRemediationCode as getCoreRemediationCode,
} from 'linkglimpse/core/remediation';

export function getRemediationCode(check: MetadataCheck, metadata: ApiResponse): string {
  return getCoreRemediationCode(check, metadata);
}

export function buildAiAgentPrompt(metadata: ApiResponse): string {
  return buildCoreAiAgentPrompt(metadata);
}

export function buildApiCommand(metadata: ApiResponse): string {
  const targetUrl = metadata.requestedUrl || metadata.finalUrl || metadata.url;
  return `curl --get 'https://www.linkglimpse.com/api/metadata' --data-urlencode ${shellSingleQuote(`url=${targetUrl}`)}`;
}

export const platformCacheGuidance = [
  {
    platform: 'Facebook',
    steps: 'Fix the live tags, deploy, open Facebook Sharing Debugger, enter the final canonical URL, then choose Scrape Again.',
    href: 'https://developers.facebook.com/tools/debug/',
  },
  {
    platform: 'LinkedIn',
    steps: 'Fix and deploy the live page, then submit the final canonical URL to LinkedIn Post Inspector to request a fresh scrape.',
    href: 'https://www.linkedin.com/post-inspector/',
  },
  {
    platform: 'X / Twitter',
    steps: 'Fix and deploy the tags, confirm the image is public, then share the final URL again. X controls its own cache and refresh timing.',
    href: 'https://developer.x.com/en/docs/x-for-websites/cards/overview/abouts-cards',
  },
] as const;

function shellSingleQuote(value: string): string {
  return `'${value.replaceAll("'", `'"'"'`)}'`;
}
