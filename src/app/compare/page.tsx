import { GitCompareArrows } from 'lucide-react';
import ComparisonTool from '@/components/ComparisonTool';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: 'Compare Open Graph Tags Between Two URLs',
  description: 'Compare Open Graph tags, social images, canonical URLs, redirects, and diagnostic scores before and after a release.',
  path: '/compare',
  keywords: ['compare open graph tags', 'metadata comparison tool', 'compare social preview', 'og tag diff'],
});

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <GitCompareArrows className="h-6 w-6" />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">Compare Open Graph Tags Between Two URLs</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mt-6">
          Check a production page against staging, a redesign, or a replacement URL. See exactly which social metadata and delivery signals changed.
        </p>
      </section>
      <ComparisonTool />
    </div>
  );
}
