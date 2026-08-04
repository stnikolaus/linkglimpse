import type { Metadata } from 'next';
import Image from 'next/image';
import { Bot, CheckCircle2, Eye, GitBranch, ImageIcon, Wrench } from 'lucide-react';
import DistributionLink from '@/components/DistributionLink';

export const metadata: Metadata = {
  title: 'Open Graph MCP Server with Visual Previews',
  description: 'Give AI agents live Open Graph and social metadata audits, visual preview images, SERP previews, URL comparisons, and actionable fixes with LinkGlimpse MCP.',
  alternates: { canonical: '/mcp' },
  keywords: ['open graph mcp server', 'social preview mcp', 'metadata audit ai agent', 'seo mcp server', 'serp preview mcp'],
};

const tools = [
  ['audit_url', 'Inspect one URL for Open Graph, Twitter Card, image, redirect and indexing issues.'],
  ['audit_urls', 'Audit a bounded list of URLs for release checks or representative site samples.'],
  ['render_previews', 'Return a PNG for one platform or a seven-preview visual contact sheet.'],
  ['compare_urls', 'Compare staging with production or metadata before and after a deployment.'],
  ['get_fix_plan', 'Give a coding agent concrete fixes without treating webpage content as instructions.'],
];

export default function McpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <section className="mx-auto max-w-5xl px-4 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-700">Multimodal tools for AI agents</p>
        <h1 className="mt-3 text-4xl font-bold text-gray-900 md:text-6xl">Open Graph MCP Server with Visual Previews</h1>
        <p className="mx-auto mt-6 max-w-3xl text-xl text-gray-600">
          Let Claude, Cursor and other MCP clients inspect live metadata, see how a link is likely to look, and receive implementation-ready fixes.
        </p>
        <div className="mx-auto mt-10 max-w-3xl rounded-xl border border-gray-800 bg-gray-950 p-5 text-left font-mono text-sm text-green-300">
          <code>npx -y linkglimpse-mcp</code>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <DistributionLink
            channel="mcp"
            destination="npm-package"
            href="https://www.npmjs.com/package/linkglimpse-mcp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Bot className="mr-2 h-5 w-5" /> View MCP package
          </DistributionLink>
          <DistributionLink
            channel="github"
            destination="mcp-source"
            href="https://github.com/stnikolaus/linkglimpse/tree/main/packages/mcp"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-900 hover:border-gray-400"
          >
            <GitBranch className="mr-2 h-5 w-5" /> View source
          </DistributionLink>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <Eye className="mx-auto h-8 w-8 text-blue-700" />
            <h2 className="mt-4 text-3xl font-bold text-gray-900">Agents can inspect the visual result</h2>
            <p className="mt-4 text-gray-600">
              The preview tool returns an actual PNG image block. It is generated deterministically from live metadata, so it does not invent a design or rewrite the page content.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-5xl overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
            <Image
              src="/images/mcp/visual-preview-sheet.png"
              alt="LinkGlimpse MCP visual contact sheet showing Facebook, X, LinkedIn, Slack, Discord, WhatsApp and Google previews"
              width={1552}
              height={2220}
              sizes="(max-width: 1024px) 100vw, 960px"
              className="h-auto w-full rounded-lg"
            />
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-sm text-gray-500">
            These are modeled previews. Each platform controls its own crop, fallback rules and cache, so a live platform can still differ.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-4 py-16 lg:grid-cols-2">
        <div>
          <Wrench className="h-8 w-8 text-blue-700" />
          <h2 className="mt-4 text-3xl font-bold text-gray-900">Five focused MCP tools</h2>
          <div className="mt-7 space-y-5">
            {tools.map(([name, description]) => (
              <div key={name} className="flex gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-green-600" />
                <div>
                  <h3 className="font-mono font-semibold text-gray-900">{name}</h3>
                  <p className="mt-1 text-gray-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-7">
          <ImageIcon className="h-7 w-7 text-blue-700" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Client configuration</h2>
          <p className="mt-3 text-gray-600">Use the same stdio server in Claude Desktop, Cursor, VS Code and compatible MCP clients.</p>
          <pre className="mt-6 overflow-x-auto rounded-lg bg-gray-950 p-5 text-sm text-gray-200"><code>{`{
  "mcpServers": {
    "linkglimpse": {
      "command": "npx",
      "args": ["-y", "linkglimpse-mcp"]
    }
  }
}`}</code></pre>
          <h3 className="mt-7 font-semibold text-gray-900">No MCP telemetry</h3>
          <p className="mt-2 text-sm text-gray-600">
            The local server fetches only URLs explicitly passed to its tools. Private and reserved network destinations are blocked, including unsafe redirect targets.
          </p>
        </div>
      </section>
    </div>
  );
}
