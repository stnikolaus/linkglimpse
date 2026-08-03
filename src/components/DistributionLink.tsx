'use client';

import type { ComponentProps, MouseEvent } from 'react';
import { useLinkGlimpseAnalytics } from '@/components/PlausibleEvents';

type DistributionLinkProps = ComponentProps<'a'> & {
  channel: string;
  destination?: string;
};

export default function DistributionLink({ channel, destination, href = '#', onClick, ...props }: DistributionLinkProps) {
  const analytics = useLinkGlimpseAnalytics();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    analytics.trackDistributionClicked(channel, destination || href);
    onClick?.(event);
  };

  return <a href={href} onClick={handleClick} {...props} />;
}
