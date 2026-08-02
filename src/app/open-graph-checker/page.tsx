import Link from 'next/link';
import { CheckCircle2, Code2, FileDown, ImageIcon } from 'lucide-react';
import SocialPreview from '@/components/SocialPreview';
import FAQStructuredData from '@/components/FAQStructuredData';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Open Graph Checker: Test OG Tags & Images',
  description: 'Check Open Graph and Twitter Card tags for any URL. Preview social cards, test the OG image, find metadata errors, and get an actionable score.',
  path: '/open-graph-checker',
  keywords: ['open graph checker', 'open graph test', 'og image checker', 'og check', 'open graph tester'],
});

const faqItems = [
  {
    question: 'What does the Open Graph checker test?',
    answer: 'It fetches the public page, extracts Open Graph and Twitter Card tags, checks canonical and robots directives, inspects the share image response, and turns the findings into actionable checks.',
  },
  {
    question: 'Can I inspect the exact tags LinkGlimpse found?',
    answer: 'Yes. Expand the raw-tag view to see the extracted metadata, or download the complete diagnostics report as JSON.',
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
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">Open Graph Checker: Test OG Tags &amp; Images</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
          Check Open Graph and Twitter Card tags for any URL. Preview social cards, test the OG image, find metadata errors, and get an actionable score.
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
            { icon: FileDown, title: 'Exportable Metadata Report', text: 'Copy or download a JSON report for a developer, client, or release checklist.' },
          ].map((item) => (
            <article key={item.title} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
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
      </section>
    </div>
  );
}
