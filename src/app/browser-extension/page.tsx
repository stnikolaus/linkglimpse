import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Chrome, ExternalLink, Github, MousePointerClick, ShieldCheck } from 'lucide-react';
import DistributionLink from '@/components/DistributionLink';

export const metadata: Metadata = {
  title: 'Social Preview Checker Browser Extension',
  description: 'Inspect the current page with the open-source LinkGlimpse extension for Chrome and Firefox. Check Open Graph tags, social cards, images, and redirects.',
  alternates: { canonical: '/browser-extension' },
  keywords: ['social preview chrome extension', 'open graph checker extension', 'twitter card browser extension', 'open graph firefox addon'],
};

export default function BrowserExtensionPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900">
          <Chrome className="h-7 w-7" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-700">Chrome and Firefox</p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-6xl">Social Preview Checker Browser Extension</h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600">
          Open a page, click LinkGlimpse, and get a live report with social previews, metadata diagnostics, image checks, redirects, and copy-ready fixes.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <DistributionLink
            channel="github"
            destination="extension-source"
            href="https://github.com/stnikolaus/social-preview/tree/main/apps/browser-extension"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white hover:bg-gray-800"
          >
            <Github className="mr-2 h-5 w-5" /> View source and install locally
          </DistributionLink>
          <Link href="/open-graph-checker" className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 hover:border-gray-400">
            Try the web checker <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <p className="mt-4 text-sm text-gray-500">Chrome Web Store and Firefox Add-ons submissions are being prepared.</p>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 md:grid-cols-3">
          {[
            { icon: MousePointerClick, title: 'Explicitly activated', text: 'It runs only when you open the popup or choose the LinkGlimpse context-menu command.' },
            { icon: ShieldCheck, title: 'Minimal permissions', text: 'Only activeTab and contextMenus—no browser history, cookies, credentials, or access to every site.' },
            { icon: CheckCircle2, title: 'Actionable report', text: 'See platform previews, diagnostic severity, metadata values, and specific remediation guidance.' },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-gray-200 p-6">
              <item.icon className="h-7 w-7 text-blue-700" />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h2>
              <p className="mt-2 text-gray-600">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900">Build the extension locally</h2>
        <p className="mt-4 text-gray-600">Clone the public repository, install dependencies, and create both browser builds:</p>
        <pre className="mt-6 overflow-x-auto rounded-xl bg-gray-950 p-5 text-sm leading-relaxed text-green-300"><code>{`corepack enable
pnpm install
pnpm extension:build`}</code></pre>
        <p className="mt-5 text-gray-600">
          Load <code className="rounded bg-gray-100 px-1.5 py-0.5">dist/extension/chrome</code> as an unpacked Chrome extension or <code className="rounded bg-gray-100 px-1.5 py-0.5">dist/extension/firefox</code> as a temporary Firefox add-on.
        </p>
      </section>
    </div>
  );
}
