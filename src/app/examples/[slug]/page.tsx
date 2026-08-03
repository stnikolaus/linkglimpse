import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import DiagnosticsPanel from '@/components/DiagnosticsPanel';
import SocialPreviewTabs from '@/components/SocialPreviewTabs';
import { exampleReports, getExampleReport } from '@/lib/example-reports';
import { createPageMetadata } from '@/lib/seo';

interface ExamplePageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return exampleReports.map((example) => ({ slug: example.slug }));
}

export async function generateMetadata({ params }: ExamplePageProps): Promise<Metadata> {
  const { slug } = await params;
  const example = getExampleReport(slug);
  if (!example) return { title: 'Example Report Not Found' };
  return createPageMetadata({
    title: example.title,
    description: example.description,
    path: `/examples/${example.slug}`,
    keywords: ['open graph report example', example.intent.toLowerCase(), 'social metadata diagnostics'],
  });
}

export default async function ExamplePage({ params }: ExamplePageProps) {
  const { slug } = await params;
  const example = getExampleReport(slug);
  if (!example) notFound();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <section className="max-w-5xl mx-auto px-4 pt-12 pb-10">
        <Link href="/examples" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4" /> All example reports
        </Link>
        <p className="mt-8 text-sm font-bold uppercase tracking-widest text-blue-700">{example.intent}</p>
        <h1 className="mt-3 text-4xl md:text-5xl font-bold text-gray-900">{example.title}</h1>
        <p className="mt-5 text-xl text-gray-600 max-w-4xl">{example.description}</p>
        <p className="mt-5 rounded-xl border border-blue-200 bg-blue-50 p-4 text-gray-700">{example.explanation}</p>
      </section>

      <div className="max-w-6xl mx-auto px-4 pb-16">
        <DiagnosticsPanel
          metadata={example.report}
          previewTitle="Example social previews"
          preview={<SocialPreviewTabs metadata={example.report} />}
        />
      </div>
    </div>
  );
}
