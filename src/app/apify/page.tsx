import type { Metadata } from 'next';
import Link from 'next/link';
import { Bot, CheckCircle2, ExternalLink, FileImage, ListChecks, Wrench } from 'lucide-react';
import DistributionLink from '@/components/DistributionLink';
import { createPageAlternates } from '@/lib/seo';

const APIFY_ACTOR_URL = 'https://apify.com/changetheway/linkglimpse-apify-actor';

export const metadata: Metadata = {
  title: 'Open Graph Scraper for Apify',
  description: 'Run the LinkGlimpse Apify Actor to audit Open Graph and Twitter Card metadata for up to 100 URLs, generate social preview images, and export structured fixes.',
  alternates: createPageAlternates('/apify'),
  keywords: ['open graph scraper', 'apify seo scraper', 'social media preview api', 'twitter card scraper', 'metadata scraper'],
  openGraph: {
    title: 'Open Graph Scraper for Apify',
    description: 'Audit up to 100 URLs, render social preview images, and export structured Open Graph diagnostics with the LinkGlimpse Apify Actor.',
    type: 'website',
    url: 'https://www.linkglimpse.com/apify',
    images: [{
      url: '/images/icon/social-preview-1200x630.jpeg',
      width: 1200,
      height: 630,
      alt: 'LinkGlimpse Open Graph scraper and social preview generator for Apify',
    }],
  },
};

const features = [
  {
    icon: ListChecks,
    title: 'Audit up to 100 URLs',
    text: 'Submit one URL or a full list and receive consistent Open Graph, Twitter Card, image, redirect, canonical, and indexing checks.',
  },
  {
    icon: FileImage,
    title: 'Generate visual previews',
    text: 'The Actor renders preview images so you can inspect what the metadata produces instead of reviewing tag values alone.',
  },
  {
    icon: Wrench,
    title: 'Return actionable fixes',
    text: 'Each result includes a health score, passed and failed checks, developer guidance, and fixes formatted for an AI coding agent.',
  },
] as const;

export default function ApifyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-white text-emerald-700">
          <Bot className="h-7 w-7" aria-hidden="true" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-emerald-700">Available on the Apify Store</p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-6xl">Open Graph &amp; Social Preview Scraper for Apify</h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600">
          Audit social metadata at scale, generate the previews users will actually see, and export structured results for automation, QA, or client reports.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <DistributionLink
            channel="apify-store"
            destination="apify-actor"
            href={APIFY_ACTOR_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-lg bg-emerald-700 px-5 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Run the Actor on Apify <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" />
          </DistributionLink>
          <Link href="/open-graph-checker" className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 hover:border-gray-500">
            Check one URL on the web
          </Link>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-xl border border-gray-200 p-6">
              <feature.icon className="h-7 w-7 text-emerald-700" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{feature.title}</h2>
              <p className="mt-2 text-gray-600">{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-start">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">What the Actor returns</h2>
            <p className="mt-4 text-lg text-gray-600">
              Every dataset item combines extracted metadata with the diagnostic evidence needed to understand the result. That makes the Actor useful in no-code workflows, scheduled QA runs, and larger SEO pipelines.
            </p>
            <ul className="mt-6 space-y-3 text-gray-700">
              {[
                'Open Graph, Twitter Card, canonical, robots, and HTTP response data',
                'Metadata health score with passed, warning, and failed checks',
                'Share-image dimensions, type, file size, and aspect-ratio validation',
                'Rendered Facebook, X, LinkedIn, Slack, Discord, WhatsApp, and Google previews',
                'Developer remediation plus a copy-ready prompt for an AI coding agent',
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-gray-200 bg-gray-950 p-6 text-sm text-gray-100">
            <p className="font-semibold text-white">Example Actor input</p>
            <pre className="mt-4 overflow-x-auto text-green-300"><code>{`{
  "urls": [
    "https://example.com",
    "https://example.com/pricing"
  ],
  "renderPreviews": true
}`}</code></pre>
            <p className="mt-6 border-t border-gray-700 pt-5 text-gray-300">
              Run it manually, call it through the Apify API, or schedule recurring metadata audits from the Apify Console.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
