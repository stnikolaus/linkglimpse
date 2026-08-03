'use client';

import { useState, type KeyboardEvent } from 'react';
import {
  AtSign,
  Cloud,
  Facebook,
  Hash,
  Instagram,
  Linkedin,
  MessageCircle,
  Search,
  Twitter,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { ApiResponse } from '@/types';
import { useLinkGlimpseAnalytics } from './PlausibleEvents';
import {
  BlueskyPreview,
  FacebookPreview,
  GoogleSearchPreview,
  InstagramPreview,
  LinkedInPreview,
  MastodonPreview,
  NextdoorPreview,
  ThreadsPreview,
  TumblrPreview,
  TwitterPreview,
} from './social-previews';

type PreviewPlatform =
  | 'facebook'
  | 'twitter'
  | 'linkedin'
  | 'instagram'
  | 'threads'
  | 'tumblr'
  | 'mastodon'
  | 'nextdoor'
  | 'bluesky'
  | 'google';

interface PlatformTab {
  id: PreviewPlatform;
  label: string;
  icon: LucideIcon;
  iconClassName: string;
}

interface SocialPreviewTabsProps {
  metadata: ApiResponse;
}

const PLATFORM_TABS: PlatformTab[] = [
  { id: 'facebook', label: 'Facebook', icon: Facebook, iconClassName: 'text-blue-600' },
  { id: 'twitter', label: 'X / Twitter', icon: Twitter, iconClassName: 'text-blue-400' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, iconClassName: 'text-blue-700' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, iconClassName: 'text-pink-600' },
  { id: 'threads', label: 'Threads', icon: AtSign, iconClassName: 'text-gray-900' },
  { id: 'tumblr', label: 'Tumblr', icon: MessageCircle, iconClassName: 'text-blue-800' },
  { id: 'mastodon', label: 'Mastodon', icon: Users, iconClassName: 'text-purple-600' },
  { id: 'nextdoor', label: 'Nextdoor', icon: Hash, iconClassName: 'text-green-700' },
  { id: 'bluesky', label: 'Bluesky', icon: Cloud, iconClassName: 'text-sky-500' },
  { id: 'google', label: 'Google Search', icon: Search, iconClassName: 'text-green-600' },
];

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function renderPlatformPreview(platform: PreviewPlatform, metadata: ApiResponse) {
  const title = metadata.title || 'No title available';
  const description = metadata.description || 'No description available';
  const domain = getDomain(metadata.url);
  const profileImage = 'https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png';
  const socialText = `${metadata.title || 'No title'}\n\n${metadata.description || 'No description'}\n\n${metadata.url}`;

  switch (platform) {
    case 'facebook':
      return (
        <FacebookPreview
          title={title}
          description={description}
          url={metadata.url}
          image={metadata.image}
          user={{ displayName: domain }}
        />
      );
    case 'twitter':
      return (
        <TwitterPreview
          tweets={[{
            date: new Date(),
            name: domain,
            profileImage,
            screenName: `@${domain.replace(/\./g, '')}`,
            text: socialText,
            media: metadata.image ? [{
              alt: metadata.title || 'Image',
              url: metadata.image,
              type: 'image/jpeg',
            }] : undefined,
          }]}
        />
      );
    case 'linkedin':
      return (
        <LinkedInPreview
          title={title}
          description={description}
          url={metadata.url}
          image={metadata.image}
          name={domain}
          profileImage="https://static.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q"
          jobTitle="Website"
        />
      );
    case 'instagram':
      return (
        <InstagramPreview
          image={metadata.image}
          name={domain}
          profileImage={profileImage}
          caption={socialText}
        />
      );
    case 'threads':
      return (
        <ThreadsPreview
          posts={[{
            date: new Date(),
            name: domain,
            profileImage,
            caption: socialText,
            image: metadata.image,
            title,
            url: metadata.url,
            media: metadata.image ? [{
              alt: metadata.title || 'Image',
              url: metadata.image,
              type: 'image/jpeg',
            }] : undefined,
          }]}
        />
      );
    case 'tumblr':
      return (
        <TumblrPreview
          title={title}
          description={description}
          url={metadata.url}
          image={metadata.image}
          user={{ displayName: domain }}
        />
      );
    case 'mastodon':
      return (
        <MastodonPreview
          title={title}
          description={description}
          url={metadata.url}
          image={metadata.image}
          user={{
            displayName: domain,
            avatarUrl: profileImage,
            address: `@${domain.replace(/\./g, '')}@mastodon.social`,
          }}
        />
      );
    case 'nextdoor':
      return (
        <NextdoorPreview
          title={title}
          description={description}
          url={metadata.url}
          image={metadata.image}
          name={domain}
          profileImage="https://static.licdn.com/sc/h/1c5u578iilxfi4m4dvc4q810q"
        />
      );
    case 'bluesky':
      return (
        <BlueskyPreview
          title={title}
          description={description}
          customText={socialText}
          url={metadata.url}
          image={metadata.image}
          user={{
            displayName: domain,
            avatarUrl: profileImage,
            address: `@${domain.replace(/\./g, '')}.bsky.social`,
          }}
        />
      );
    case 'google':
      return (
        <GoogleSearchPreview
          title={title}
          description={description}
          url={metadata.url}
          siteTitle={metadata.siteName}
        />
      );
  }
}

export default function SocialPreviewTabs({ metadata }: SocialPreviewTabsProps) {
  const [activePlatform, setActivePlatform] = useState<PreviewPlatform>('facebook');
  const analytics = useLinkGlimpseAnalytics();
  const activeTab = PLATFORM_TABS.find((tab) => tab.id === activePlatform) ?? PLATFORM_TABS[0];

  const selectPlatform = (platform: PreviewPlatform) => {
    setActivePlatform(platform);
    analytics.trackPlatformNavigation(platform);
  };

  const handleTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, currentIndex: number) => {
    let nextIndex: number | undefined;

    if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % PLATFORM_TABS.length;
    if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + PLATFORM_TABS.length) % PLATFORM_TABS.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = PLATFORM_TABS.length - 1;
    if (nextIndex === undefined) return;

    event.preventDefault();
    const nextTab = PLATFORM_TABS[nextIndex];
    selectPlatform(nextTab.id);
    document.getElementById(`social-preview-tab-${nextTab.id}`)?.focus();
  };

  return (
    <div className="min-w-0">
      <div
        className="mb-4 flex flex-wrap items-center gap-1 border-b border-gray-200 pb-3"
        role="tablist"
        aria-label="Choose a social platform preview"
      >
        {PLATFORM_TABS.map((tab, index) => {
          const Icon = tab.icon;
          const isActive = tab.id === activePlatform;

          return (
            <button
              key={tab.id}
              id={`social-preview-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls="social-preview-tabpanel"
              tabIndex={isActive ? 0 : -1}
              title={tab.label}
              onClick={() => selectPlatform(tab.id)}
              onKeyDown={(event) => handleTabKeyDown(event, index)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                isActive
                  ? 'border-gray-300 bg-white shadow-sm ring-2 ring-blue-100'
                  : 'border-transparent hover:border-gray-200 hover:bg-white'
              }`}
            >
              <Icon className={`h-6 w-6 ${tab.iconClassName}`} aria-hidden="true" />
              <span className="sr-only">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div
        id="social-preview-tabpanel"
        role="tabpanel"
        aria-labelledby={`social-preview-tab-${activePlatform}`}
        tabIndex={0}
        data-preview-platform={activePlatform}
        className="min-w-0 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-gray-500">
          {activeTab.label}
        </p>
        <div className="min-w-0 overflow-hidden">
          {renderPlatformPreview(activePlatform, metadata)}
        </div>
      </div>
    </div>
  );
}
