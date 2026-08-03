import Link from 'next/link';
import { ArrowRight, FileCheck2 } from 'lucide-react';
import { exampleReports } from '@/lib/example-reports';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Open Graph Diagnostic Report Examples',
  description: 'Explore passing and failing Open Graph report examples for complete tags, missing images, and redirected social share URLs.',
  path: '/examples',
  keywords: ['open graph examples', 'og tag report example', 'social preview errors', 'open graph diagnostics'],
});

export default function ExamplesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-12 text-center">
        <FileCheck2 className="mx-auto h-12 w-12 text-blue-600" />
        <h1 className="mt-5 text-4xl md:text-6xl font-bold text-gray-900">Open Graph Diagnostic Report Examples</h1>
        <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
          Learn what passing metadata looks like, recognize common failures, and copy concrete fixes from realistic diagnostic reports.
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-20 grid gap-5 md:grid-cols-3">
        {exampleReports.map((example) => (
          <article key={example.slug} className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-blue-700">{example.intent}</p>
            <h2 className="mt-3 text-xl font-bold text-gray-900">{example.title}</h2>
            <p className="mt-3 flex-1 text-gray-600">{example.description}</p>
            <Link href={`/examples/${example.slug}`} className="mt-6 inline-flex items-center gap-2 font-semibold text-blue-700 hover:text-blue-800">
              Open example report <ArrowRight className="h-4 w-4" />
            </Link>
          </article>
        ))}
      </section>
    </div>
  );
}
