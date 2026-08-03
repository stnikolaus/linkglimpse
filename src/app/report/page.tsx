import type { Metadata } from 'next';
import Link from 'next/link';
import { Link2 } from 'lucide-react';
import SocialPreview from '@/components/SocialPreview';

export const metadata: Metadata = {
  title: 'Shared Open Graph Diagnostic Report',
  description: 'Re-run a shared URL inspection to see its current social previews, Open Graph tags, redirects, and actionable metadata checks.',
  robots: { index: false, follow: true },
  alternates: { canonical: '/open-graph-checker' },
};

interface ReportPageProps {
  searchParams: Promise<{ url?: string }>;
}

export default async function ReportPage({ searchParams }: ReportPageProps) {
  const { url } = await searchParams;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-10 text-center">
        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-700">
          <Link2 className="h-6 w-6" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Shared metadata diagnostic report</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-5">
          This report is generated from the page&apos;s live metadata, so it reflects changes made since the link was shared.
        </p>
      </section>

      <SocialPreview surface="shared-report" initialUrl={url} />

      <p className="max-w-4xl mx-auto px-4 pb-16 text-center text-sm text-gray-600">
        Want to inspect another page? Use the field above or open the{' '}
        <Link href="/open-graph-checker" className="font-semibold text-blue-700 hover:text-blue-800">Open Graph checker</Link>.
      </p>
    </div>
  );
}
