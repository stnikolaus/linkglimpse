import Link from 'next/link';
import { Boxes, Chrome, ExternalLink, Globe2 } from 'lucide-react';
import DistributionLink from '@/components/DistributionLink';

const channels = [
  {
    name: 'Chrome extension',
    eyebrow: 'Chrome Web Store',
    description: 'Audit the page in your active tab and see its score, social cards, SERP preview, and copy-ready fixes.',
    href: 'https://chromewebstore.google.com/detail/alhheglnjpjfiaehoekkndaogkfdhdga',
    channel: 'chrome-web-store',
    destination: 'browser-extension',
    cta: 'Add to Chrome',
    icon: Chrome,
    accent: 'text-blue-700',
  },
  {
    name: 'Firefox add-on',
    eyebrow: 'Firefox Browser Add-ons',
    description: 'Run the same current-page metadata audit in Firefox without copying the URL into another tool.',
    href: 'https://addons.mozilla.org/en-GB/firefox/addon/linkglimpse/',
    channel: 'firefox-add-ons',
    destination: 'browser-extension',
    cta: 'Add to Firefox',
    icon: Globe2,
    accent: 'text-orange-700',
  },
  {
    name: 'Apify scraper',
    eyebrow: 'Apify Store',
    description: 'Audit up to 100 URLs per run and export structured diagnostics plus rendered social preview images.',
    href: 'https://apify.com/changetheway/linkglimpse-apify-actor',
    channel: 'apify-store',
    destination: 'apify-actor',
    cta: 'Run on Apify',
    icon: Boxes,
    accent: 'text-emerald-700',
  },
] as const;

export default function DistributionChannels() {
  return (
    <section className="border-y border-gray-200 bg-white py-16" aria-labelledby="distribution-heading">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Now available where you work</p>
          <h2 id="distribution-heading" className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Check links without returning to the website
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Inspect the current tab in Chrome or Firefox, or run the LinkGlimpse Open Graph scraper across a URL list on Apify.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {channels.map((channel) => (
            <article key={channel.name} className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gray-100">
                  <channel.icon className={`h-6 w-6 ${channel.accent}`} aria-hidden="true" />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">{channel.eyebrow}</span>
              </div>
              <h3 className="mt-5 text-xl font-semibold text-gray-900">{channel.name}</h3>
              <p className="mt-2 flex-1 text-gray-600">{channel.description}</p>
              <DistributionLink
                channel={channel.channel}
                destination={channel.destination}
                href={channel.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex items-center font-semibold text-blue-700 hover:text-blue-900"
              >
                {channel.cta} <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
              </DistributionLink>
            </article>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
          <Link href="/browser-extension" className="font-medium text-gray-600 hover:text-gray-900">
            Compare the browser extensions
          </Link>
          <Link href="/apify" className="font-medium text-gray-600 hover:text-gray-900">
            See what the Apify scraper returns
          </Link>
        </div>
      </div>
    </section>
  );
}
