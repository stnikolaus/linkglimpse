import type { PostHog } from 'posthog-js';

let posthogPromise: Promise<PostHog | null> | undefined;

export function getPostHog(): Promise<PostHog | null> {
  const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  if (!projectToken) return Promise.resolve(null);

  posthogPromise ??= import('posthog-js').then(({ default: posthog }) => {
    if (!posthog.__loaded) {
      posthog.init(projectToken, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        defaults: '2026-05-30',
        autocapture: false,
        capture_pageview: 'history_change',
        capture_pageleave: true,
        disable_session_recording: true,
        person_profiles: 'identified_only',
      });
    }
    return posthog;
  });

  return posthogPromise;
}

export function capturePostHog(event: string, properties: Record<string, string | number | boolean>): void {
  void getPostHog().then((posthog) => posthog?.capture(event, properties));
}
