import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Code2, Eye, Gauge, LockKeyhole, SearchCheck } from 'lucide-react';
import { LINKGLIMPSE_ORGANIZATION_ID, LINKGLIMPSE_PUBLIC_LINKS } from '@/lib/entity';
import { createPageMetadata, SITE_URL } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({
  title: 'How LinkGlimpse Checks Link Previews',
  description: 'Review how LinkGlimpse fetches public pages, scores metadata, models social previews, protects private networks, and reports its limitations.',
  path: '/methodology',
  keywords: ['LinkGlimpse methodology', 'Open Graph checker methodology', 'social preview diagnostic score'],
});

const reviewedDate = '2026-09-18';

const workflow = [
  {
    title: '1. Validate the submitted URL',
    description: 'LinkGlimpse accepts HTTP and HTTPS URLs without embedded credentials. It resolves the hostname before every fetch and rejects local, private, reserved, and documentation-only network ranges, including unsafe redirect targets.',
    icon: LockKeyhole,
  },
  {
    title: '2. Fetch the public HTML',
    description: 'The checker follows redirects explicitly, records each response, accepts HTML pages, and reads a bounded response. It does not sign in, bypass crawler controls, or execute the page\'s client-side JavaScript before extracting metadata.',
    icon: SearchCheck,
  },
  {
    title: '3. Extract metadata signals',
    description: 'The parser reads the document title plus Open Graph, Twitter Card, description, canonical, robots, Googlebot, site-name, and author values from the returned HTML. Relative canonical and image URLs are resolved against the final page URL.',
    icon: Code2,
  },
  {
    title: '4. Inspect the share image',
    description: 'When an image is declared, LinkGlimpse checks whether the public URL responds, whether its content type is an image, and—when detectable from the file header—its dimensions. The diagnostic also records HTTPS use, aspect ratio, and reported file size.',
    icon: Eye,
  },
] as const;

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  '@id': `${SITE_URL}/methodology#page`,
  url: `${SITE_URL}/methodology`,
  name: 'How LinkGlimpse Checks Link Previews',
  description: 'The public methodology for LinkGlimpse metadata fetching, scoring, modeled previews, privacy safeguards, and limitations.',
  about: { '@id': LINKGLIMPSE_ORGANIZATION_ID },
  author: { '@id': LINKGLIMPSE_ORGANIZATION_ID },
  dateModified: reviewedDate,
  inLanguage: 'en-US',
};

export default function MethodologyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <script
        id="methodology-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, '\\u003c'),
        }}
      />

      <section className="mx-auto max-w-5xl px-4 py-20">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Public and reproducible</p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-6xl">How LinkGlimpse checks link previews</h1>
        <p className="mt-6 max-w-4xl text-xl leading-8 text-gray-700">
          LinkGlimpse turns the initial HTML and public share image for a URL into deterministic metadata checks, modeled previews, and copy-ready repairs. This page explains what the result measures—and what it cannot prove.
        </p>
        <p className="mt-4 text-sm text-gray-500">Methodology reviewed {reviewedDate}.</p>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900">Inspection workflow</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {workflow.map((step) => (
              <article key={step.title} className="rounded-2xl border border-gray-200 bg-gray-50 p-7">
                <step.icon className="h-7 w-7 text-blue-700" aria-hidden="true" />
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-3 leading-7 text-gray-600">{step.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Gauge className="h-8 w-8 text-blue-700" aria-hidden="true" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">How the diagnostic score works</h2>
            <p className="mt-4 leading-7 text-gray-600">
              The score is a weighted readiness summary of the checks returned for that run. A passing check receives its full weight, a warning receives half, and a failed check receives none. Page fetch, core Open Graph fields, Twitter Card type, canonical and robots directives, and image fetch quality carry more weight than supporting checks.
            </p>
            <p className="mt-4 leading-7 text-gray-600">
              The score is not a search ranking, traffic forecast, accessibility grade, or guarantee that a platform has refreshed its cache. A high score means the inspected response contains the signals LinkGlimpse tests; it does not certify every platform-specific rule.
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200 bg-white p-7">
            <h3 className="text-xl font-semibold text-gray-900">Checks included when data is available</h3>
            <ul className="mt-5 space-y-3 text-gray-600">
              {[
                'Successful page response and redirect path',
                'Open Graph title, description, image, and URL',
                'Twitter Card type, title, description, and image fallbacks',
                'Canonical URL and noindex detection',
                'Public image response, HTTPS, content type, dimensions, aspect ratio, and size',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-3xl font-bold text-gray-900">How previews are modeled</h2>
          <p className="mt-4 max-w-4xl leading-7 text-gray-600">
            Each preview maps the extracted title, description, domain, URL, and image into a representative card layout. Where appropriate, the model uses documented-style fallbacks such as Open Graph values when a dedicated Twitter value is absent. Rendering is deterministic: LinkGlimpse does not ask an AI model to invent missing page content.
          </p>
          <p className="mt-4 max-w-4xl leading-7 text-gray-600">
            Platforms operate private crawlers, caches, crop rules, and client interfaces that can change independently. LinkGlimpse therefore describes previews as representative rather than pixel-perfect, and it cannot force Facebook, LinkedIn, X, or another platform to refresh a cached card.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900">Boundaries and known limitations</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {[
            ['Initial HTML only', 'Metadata added only after client-side JavaScript runs may not appear in the inspection. Server-render important tags for crawler reliability.'],
            ['Public resources only', 'Authenticated pages, local development hosts, private networks, and reserved addresses are intentionally unavailable.'],
            ['A current fetch, not cache state', 'The report describes the response LinkGlimpse received during the run. A social platform may hold an older cached response.'],
            ['Platform policies remain authoritative', 'A passing LinkGlimpse report does not replace each platform\'s current documentation, debugger, or post inspector.'],
          ].map(([title, description]) => (
            <article key={title} className="rounded-xl border border-gray-200 bg-white p-6">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-gray-950 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14">
          <h2 className="text-3xl font-bold">Privacy and reproducibility</h2>
          <p className="mt-4 max-w-4xl leading-7 text-gray-300">
            The hosted checker fetches only the public URL a user submits. Metadata and preview API responses use private, no-store cache controls. Product analytics reduce a submitted URL to its hostname; the CLI, browser extension, and local MCP source do not add their own telemetry.
          </p>
          <div className="mt-7 flex flex-wrap gap-5 text-sm font-semibold">
            <Link className="text-blue-300 hover:underline" href="/examples">Review diagnostic examples</Link>
            <Link className="text-blue-300 hover:underline" href="/api">Use the metadata API</Link>
            <a className="text-blue-300 hover:underline" href={LINKGLIMPSE_PUBLIC_LINKS.github} target="_blank" rel="noreferrer">Inspect the source code</a>
            <Link className="text-blue-300 hover:underline" href="/privacy">Read the privacy policy</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
