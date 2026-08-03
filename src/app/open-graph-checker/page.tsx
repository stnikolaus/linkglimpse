import Link from 'next/link';
import { Bot, CheckCircle2, Code2, FileDown, GitCompareArrows, ImageIcon, Link2 } from 'lucide-react';
import SocialPreview from '@/components/SocialPreview';
import FAQStructuredData from '@/components/FAQStructuredData';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Open Graph Checker: Test OG Tags, Images & Previews',
  description: 'Run a free Open Graph test for any URL. Check OG tags and images, preview social cards, trace redirects, and copy fixes for every metadata issue.',
  path: '/open-graph-checker',
  keywords: ['open graph checker', 'og checker', 'open graph test', 'opengraph tester', 'open graph validator', 'og image checker', 'open graph preview', 'open graph debugger'],
});

const faqItems = [
  {
    question: 'What does the Open Graph checker test?',
    answer: 'It fetches the public page, extracts Open Graph and Twitter Card tags, checks canonical and robots directives, inspects the share image response, and turns the findings into actionable checks.',
  },
  {
    question: 'Can I inspect the exact tags LinkGlimpse found?',
    answer: 'Yes. Expand the raw-tag view, copy a fix for any warning, download the JSON report, or copy a complete repair prompt for an AI coding agent.',
  },
  {
    question: 'Does a high score guarantee the same preview on every platform?',
    answer: 'No checker can control platform caches or private crawler rules. The score confirms that the public metadata and assets contain the core signals those platforms use.',
  },
];

export default function OpenGraphCheckerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <FAQStructuredData items={faqItems} />
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
        <p className="text-sm font-semibold text-blue-700 uppercase tracking-widest mb-3">Technical link QA</p>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">Open Graph Checker: Test OG Tags, Images &amp; Previews</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
          Run a live Open Graph test for any URL. Inspect the tags and share image, preview the resulting cards, trace redirects, and copy the exact fixes your page needs.
        </p>
      </section>

      <SocialPreview surface="open-graph-checker" />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">What the Open Graph Checker Tests</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { icon: CheckCircle2, title: 'Open Graph Readiness Score', text: 'Separate passes, warnings, and failures with specific fixes.' },
            { icon: Code2, title: 'Raw OG & Twitter Tag Inspector', text: 'Verify the exact Open Graph, Twitter, robots, and canonical values found.' },
            { icon: ImageIcon, title: 'OG Image Validation', text: 'Check whether the image responds publicly, its format, byte size, and dimensions.' },
            { icon: FileDown, title: 'Shareable Metadata Report', text: 'Copy, share, or download the live report for a developer, client, or release checklist.' },
          ].map((item) => (
            <article key={item.title} className="bg-white border border-gray-200 rounded-xl p-6">
              <item.icon className="h-7 w-7 text-blue-600 mb-4" />
              <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
              <p className="text-gray-600 mt-2">{item.text}</p>
            </article>
          ))}
        </div>
        <p className="text-center text-gray-600 mt-10">
          Need a platform-specific workflow? Use the <Link className="text-blue-700 font-medium" href="/twitter-card-validator">Twitter Card validator</Link>,{' '}
          <Link className="text-blue-700 font-medium" href="/linkedin-post-preview">LinkedIn post preview</Link>, or{' '}
          <Link className="text-blue-700 font-medium" href="/facebook-open-graph-debugger">Facebook Open Graph debugger</Link>.
        </p>

        <div className="mt-16 grid gap-5 md:grid-cols-3 text-left">
          {[
            { icon: Bot, title: 'Copy for an AI agent', text: 'Generate a self-contained repair prompt with the failed checks, current tags, suggested code, and verification requirements.' },
            { icon: GitCompareArrows, title: 'Compare before and after', text: 'Diff a production URL against staging or a replacement page before you ship metadata changes.', href: '/compare', link: 'Compare two URLs' },
            { icon: Link2, title: 'Keep a live report URL', text: 'Share a re-runnable report link. It fetches the page again so collaborators see the latest deployed metadata.', href: '/examples', link: 'View report examples' },
          ].map((item) => (
            <article key={item.title} className="rounded-xl border border-gray-200 bg-white p-6">
              <item.icon className="h-7 w-7 text-purple-600" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.text}</p>
              {item.href && <Link href={item.href} className="mt-4 inline-flex font-semibold text-blue-700 hover:text-blue-800">{item.link} →</Link>}
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 text-left">
          <h2 className="text-3xl font-bold text-gray-900">How to Run an Open Graph Test</h2>
          <ol className="mt-6 grid gap-5 md:grid-cols-3">
            <li><span className="font-semibold text-gray-900">1. Enter the final public URL.</span><p className="mt-1 text-gray-600">The checker follows and records redirects, fetches the HTML, and inspects the declared share image.</p></li>
            <li><span className="font-semibold text-gray-900">2. Review previews and failures.</span><p className="mt-1 text-gray-600">Confirm the visible title, description, and crop, then work through warnings in the diagnostic report.</p></li>
            <li><span className="font-semibold text-gray-900">3. Copy a fix and retest.</span><p className="mt-1 text-gray-600">Paste the suggested code or AI-agent prompt into your workflow, deploy, and rerun the same URL to verify it.</p></li>
          </ol>

          <h2 className="mt-12 text-3xl font-bold text-gray-900">Minimum Open Graph Tags</h2>
          <p className="mt-4 text-gray-600">A reliable link preview starts with one clear value for each core property. Use absolute HTTPS URLs for the page and image.</p>
          <pre className="mt-5 overflow-x-auto rounded-xl bg-gray-950 p-5 text-sm leading-relaxed text-green-300"><code>{`<meta property="og:title" content="A clear, specific title" />
<meta property="og:description" content="A concise reason to open this page." />
<meta property="og:image" content="https://example.com/social-card.jpg" />
<meta property="og:url" content="https://example.com/page" />
<meta property="og:type" content="website" />
<meta name="twitter:card" content="summary_large_image" />`}</code></pre>

          <h2 className="mt-12 text-3xl font-bold text-gray-900">Fix the Most Common Open Graph Problems</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { href: '/blog/open-graph-image-not-showing', title: 'Open Graph image not showing', text: 'Debug missing, blocked, relative, or incorrectly sized share images.' },
              { href: '/blog/twitter-card-preview-not-showing', title: 'Twitter/X Card preview not showing', text: 'Fix card type, image, fallback, crawler, and cache problems.' },
              { href: '/blog/linkedin-link-preview-not-updating', title: 'LinkedIn preview not updating', text: 'Separate live metadata problems from LinkedIn cache problems.' },
              { href: '/blog/facebook-link-preview-wrong', title: 'Facebook link preview wrong', text: 'Correct stale titles, images, descriptions, and canonical mismatches.' },
              { href: '/blog/open-graph-image-size', title: 'Open Graph image sizes by platform', text: 'Choose a safe aspect ratio, dimensions, format, and file size.' },
              { href: '/blog/open-graph-tags-guide', title: 'Complete OG tag templates', text: 'Copy implementation examples for HTML, Next.js, React, and WordPress.' },
            ].map((resource) => (
              <Link key={resource.href} href={resource.href} className="rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:bg-blue-50/40">
                <h3 className="font-semibold text-gray-900">{resource.title}</h3>
                <p className="mt-1 text-sm text-gray-600">{resource.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
