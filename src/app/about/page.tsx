import type { Metadata } from 'next';
import Link from 'next/link';
import { Bot, Boxes, Code2, ExternalLink, Github, Puzzle, ShieldCheck } from 'lucide-react';
import {
  LINKGLIMPSE_ENTITY_DESCRIPTION,
  LINKGLIMPSE_ORGANIZATION_ID,
  LINKGLIMPSE_PUBLIC_LINKS,
  LINKGLIMPSE_SAME_AS,
} from '@/lib/entity';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'About LinkGlimpse',
  description: 'Learn who maintains LinkGlimpse, how the open-source checker works, which public distribution channels are available, and how it handles submitted URLs.',
  path: '/about',
  keywords: ['about LinkGlimpse', 'open source link preview checker', 'metadata diagnostic tool'],
});

const publicSurfaces = [
  {
    title: 'Source code',
    description: 'The website, diagnostics, CLI, extensions, Actor, and MCP source are available under AGPL-3.0-or-later.',
    href: LINKGLIMPSE_PUBLIC_LINKS.github,
    label: 'View GitHub repository',
    icon: Github,
  },
  {
    title: 'npm CLI',
    description: 'Run URL metadata audits locally or in CI with the published linkglimpse command-line package.',
    href: LINKGLIMPSE_PUBLIC_LINKS.npm,
    label: 'View npm CLI package',
    icon: Code2,
  },
  {
    title: 'Browser extensions',
    description: 'Inspect the active public tab from Chrome or Firefox without granting browsing-history access.',
    href: LINKGLIMPSE_PUBLIC_LINKS.chrome,
    secondaryHref: LINKGLIMPSE_PUBLIC_LINKS.firefox,
    label: 'Chrome Web Store',
    secondaryLabel: 'Firefox Add-ons',
    icon: Puzzle,
  },
  {
    title: 'Apify Actor',
    description: 'Audit up to 100 public URLs per run and export structured diagnostics plus modeled preview images.',
    href: LINKGLIMPSE_PUBLIC_LINKS.apify,
    label: 'View Apify Actor',
    icon: Boxes,
  },
  {
    title: 'MCP source',
    description: 'The multimodal MCP server source is public and tested. Its npm package and official registry listing are not published yet.',
    href: LINKGLIMPSE_PUBLIC_LINKS.mcpSource,
    label: 'Review MCP source',
    icon: Bot,
  },
] as const;

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': `${LINKGLIMPSE_PUBLIC_LINKS.about}#page`,
      url: LINKGLIMPSE_PUBLIC_LINKS.about,
      name: 'About LinkGlimpse',
      description: LINKGLIMPSE_ENTITY_DESCRIPTION,
      mainEntity: { '@id': LINKGLIMPSE_ORGANIZATION_ID },
      inLanguage: 'en-US',
    },
    {
      '@type': 'Organization',
      '@id': LINKGLIMPSE_ORGANIZATION_ID,
      name: 'LinkGlimpse',
      url: LINKGLIMPSE_PUBLIC_LINKS.website,
      description: LINKGLIMPSE_ENTITY_DESCRIPTION,
      logo: 'https://www.linkglimpse.com/images/link-icon.svg',
      sameAs: LINKGLIMPSE_SAME_AS,
    },
  ],
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <script
        id="about-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <section className="mx-auto max-w-5xl px-4 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Free, open source, no signup</p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-6xl">About LinkGlimpse</h1>
        <p className="mt-6 max-w-4xl text-xl leading-8 text-gray-700">{LINKGLIMPSE_ENTITY_DESCRIPTION}</p>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <article className="rounded-2xl border border-gray-200 bg-white p-7">
            <h2 className="text-2xl font-bold text-gray-900">What the checker does</h2>
            <p className="mt-4 leading-7 text-gray-600">
              LinkGlimpse fetches a public URL on demand, extracts its Open Graph, Twitter Card, canonical, robots, redirect, and image signals, then turns those inputs into representative social previews and concrete repair guidance.
            </p>
          </article>
          <article className="rounded-2xl border border-gray-200 bg-white p-7">
            <h2 className="text-2xl font-bold text-gray-900">What it does not claim</h2>
            <p className="mt-4 leading-7 text-gray-600">
              The previews are modeled from live metadata. Social platforms control their own crawlers, caches, crops, fallbacks, and final rendering, so no third-party checker can promise a pixel-perfect platform result or clear a platform cache.
            </p>
          </article>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900">Ownership, maintenance, and pricing</h2>
          <div className="mt-7 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">Maintained openly</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                LinkGlimpse is maintained by Ivan Homola through{' '}
                <a className="text-blue-700 hover:underline" href={LINKGLIMPSE_PUBLIC_LINKS.maintainer} target="_blank" rel="noreferrer">Tetriz.io</a>.
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">Open-source license</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                The public repository uses the GNU Affero General Public License v3.0 or later.
              </p>
            </div>
            <div className="rounded-xl bg-gray-50 p-6">
              <h3 className="font-semibold text-gray-900">Free core workflow</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">
                The hosted single-URL checker is free and does not require an account. Public endpoints may use protective rate limits.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900">Official LinkGlimpse surfaces</h2>
        <p className="mt-3 max-w-3xl text-gray-600">
          These links identify the website, source, and currently available distribution channels. The MCP release status is stated separately so an unpublished package is never presented as installable.
        </p>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {publicSurfaces.map((surface) => (
            <article key={surface.title} className="rounded-xl border border-gray-200 bg-white p-6">
              <surface.icon className="h-7 w-7 text-blue-700" aria-hidden="true" />
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{surface.title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{surface.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
                <a className="inline-flex items-center text-blue-700 hover:underline" href={surface.href} target="_blank" rel="noreferrer">
                  {surface.label}<ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
                </a>
                {'secondaryHref' in surface && (
                  <a className="inline-flex items-center text-blue-700 hover:underline" href={surface.secondaryHref} target="_blank" rel="noreferrer">
                    {surface.secondaryLabel}<ExternalLink className="ml-1 h-4 w-4" aria-hidden="true" />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <ShieldCheck className="h-8 w-8 text-blue-300" aria-hidden="true" />
          <h2 className="mt-4 text-3xl font-bold">Privacy and reproducibility</h2>
          <p className="mt-4 max-w-3xl leading-7 text-gray-300">
            LinkGlimpse processes the public URL a user explicitly submits. Product analytics reduce submitted URLs to their hostname, while the CLI, browser extension, and local MCP source do not add their own telemetry.
          </p>
          <div className="mt-6 flex flex-wrap gap-5 text-sm font-semibold">
            <Link className="text-blue-300 hover:underline" href="/methodology">Review the methodology</Link>
            <Link className="text-blue-300 hover:underline" href="/privacy">Read the privacy policy</Link>
            <a className="text-blue-300 hover:underline" href="mailto:privacy@linkglimpse.com">Contact privacy@linkglimpse.com</a>
          </div>
        </div>
      </section>
    </div>
  );
}
