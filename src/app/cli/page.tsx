import type { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle2, Code2, GitBranch, Terminal } from 'lucide-react';
import DistributionLink from '@/components/DistributionLink';

export const metadata: Metadata = {
  title: 'Open Graph CLI for Metadata Checks',
  description: 'Run Open Graph, Twitter Card, image, redirect, and indexing diagnostics from your terminal or CI pipeline with the open-source LinkGlimpse CLI.',
  alternates: { canonical: '/cli' },
  keywords: ['open graph cli', 'metadata checker cli', 'open graph validator npm', 'twitter card cli', 'social preview ci'],
};

const checks = [
  'Open Graph and Twitter Card tags',
  'Share-image response, format, dimensions, and aspect ratio',
  'HTTP status, redirects, canonical URL, and robots directives',
  'CI exit codes for failures or warnings',
];

export default function CliPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-900">
          <Terminal className="h-7 w-7" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-widest text-blue-700">Open-source developer tool</p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-6xl">Open Graph CLI for Metadata Checks</h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600">
          Audit a public URL from your terminal, fail a CI job when social metadata regresses, or pipe the complete diagnostic report into another tool.
        </p>

        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gray-800 bg-gray-950 p-5 text-left font-mono text-sm text-green-300">
          <code>npx linkglimpse https://example.com --fail-on warning</code>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <DistributionLink
            channel="npm"
            destination="npm-package"
            href="https://www.npmjs.com/package/linkglimpse"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Terminal className="mr-2 h-5 w-5" /> View npm package
          </DistributionLink>
          <DistributionLink
            channel="github"
            destination="cli-source"
            href="https://github.com/stnikolaus/social-preview/tree/main/packages/cli"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 hover:border-gray-400"
          >
            <GitBranch className="mr-2 h-5 w-5" /> View source
          </DistributionLink>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Useful in a terminal and in CI</h2>
            <ul className="mt-7 space-y-4">
              {checks.map((check) => (
                <li key={check} className="flex gap-3 text-gray-700">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
                  <span>{check}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-5 rounded-xl border border-gray-200 bg-gray-50 p-7">
            <div>
              <p className="text-sm font-semibold text-gray-900">Readable audit</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-200"><code>npx linkglimpse example.com</code></pre>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Machine-readable output</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-200"><code>npx linkglimpse example.com --json</code></pre>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">Self-hosted API</p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-950 p-4 text-sm text-gray-200"><code>npx linkglimpse example.com --api-base http://localhost:3000</code></pre>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-16 text-center">
        <Code2 className="mx-auto h-8 w-8 text-blue-700" />
        <h2 className="mt-4 text-3xl font-bold text-gray-900">No CLI telemetry</h2>
        <p className="mx-auto mt-4 max-w-2xl text-gray-600">
          The CLI sends only the URL you explicitly audit to the selected LinkGlimpse deployment. Point it at localhost or your own deployment whenever you do not want to use the public API.
        </p>
        <Link href="/api" className="mt-6 inline-flex font-semibold text-blue-700 hover:text-blue-800">Read the API documentation →</Link>
      </section>
    </div>
  );
}
