import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, Share2, Eye, Zap, CheckCircle, ArrowRight, Facebook, Twitter, Linkedin, Search, Instagram, MessageCircle, Users, Hash, BarChart3, Code, ShieldCheck, FileDown } from 'lucide-react';
import SocialPreview from '@/components/SocialPreview';
import FAQStructuredData from '@/components/FAQStructuredData';

export const metadata: Metadata = {
  title: 'Link Preview Checker for Social Media',
  description: 'Check how any URL may appear on Facebook, X, LinkedIn and more. Preview social cards, inspect Open Graph tags, and find missing images or text.',
  keywords: ['link preview', 'social share preview', 'social media preview', 'link preview tool', 'social sharing checker'],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Link Preview Checker for Social Media',
    description: 'Check how any URL may appear on Facebook, X, LinkedIn and more. Preview social cards, inspect Open Graph tags, and find missing images or text.',
    type: 'website',
    url: 'https://www.linkglimpse.com',
    siteName: 'LinkGlimpse',
    images: [{
      url: '/images/icon/social-preview-1200x630.jpeg',
      width: 1200,
      height: 630,
      alt: 'LinkGlimpse link preview and metadata diagnostics',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Link Preview Checker for Social Media',
    description: 'Check how any URL may appear on Facebook, X, LinkedIn and more. Preview social cards, inspect Open Graph tags, and find missing images or text.',
    images: ['/images/icon/social-preview-1200x630.jpeg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  const platforms = [
    { name: 'Open Graph Checker', icon: CheckCircle, path: '/open-graph-checker', color: 'text-purple-600' },
    { name: 'Facebook', icon: Facebook, path: '/facebook-open-graph-debugger', color: 'text-blue-600' },
    { name: 'Twitter / X', icon: Twitter, path: '/twitter-card-validator', color: 'text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, path: '/linkedin-post-preview', color: 'text-blue-700' },
    { name: 'Google Search', icon: Search, path: '/google-search-preview', color: 'text-green-600' },
    { name: 'Instagram', icon: Instagram, path: '/instagram-social-preview', color: 'text-pink-600' },
    { name: 'Tumblr', icon: MessageCircle, path: '/tumblr-social-preview', color: 'text-blue-500' },
    { name: 'Mastodon', icon: Users, path: '/mastodon-social-preview', color: 'text-purple-600' },
    { name: 'Nextdoor', icon: Hash, path: '/nextdoor-social-preview', color: 'text-green-700' },
    { name: 'Bluesky', icon: Hash, path: '/bluesky-social-preview', color: 'text-blue-500' },
  ];

  const features = [
    {
      icon: Eye,
      title: 'Live Social Card Previews',
      description: 'Compare representative card layouts across major social platforms in one run.'
    },
    {
      icon: Zap,
      title: 'Fast URL Metadata Checks',
      description: 'Powered by Next.js and optimized for speed. Get previews in milliseconds.'
    },
    {
      icon: Share2,
      title: '10 Social Preview Layouts',
      description: 'Facebook, X, LinkedIn, Google Search, Instagram, Threads, Tumblr, Mastodon, Nextdoor, and Bluesky.'
    },
    {
      icon: BarChart3,
      title: 'Bulk URL Checks',
      description: 'Process up to 100 URLs at once with batch export in JSON or CSV format.'
    },
    {
      icon: CheckCircle,
      title: 'Representative Platform Rendering',
              description: 'Uses custom-built social preview components for authentic platform appearances.'
    },
    {
      icon: Code,
      title: 'URL Metadata API',
      description: 'Use the REST API with copy-ready examples in several common programming languages.'
    },
    {
      icon: FileDown,
      title: 'Actionable Diagnostic Reports',
      description: 'Share reports, compare URLs, copy individual fixes, or hand the full repair prompt to an AI coding agent.'
    },
    {
      icon: Globe,
      title: 'Free, No-Signup Tool',
      description: 'No registration required. Start generating social previews immediately at no cost.'
    }
  ];

  const faqItems = [
    {
      question: "What is LinkGlimpse?",
      answer: "LinkGlimpse is a free social media preview debugger that shows how your links will appear when shared on Facebook, Twitter, LinkedIn, Instagram, and other social platforms. It helps marketers and developers optimize their social media sharing."
    },
    {
      question: "Which social media platforms are supported?",
      answer: "The all-platform view includes 10 representative layouts: Facebook, X, LinkedIn, Google Search, Instagram, Threads, Tumblr, Mastodon, Nextdoor, and Bluesky."
    },
    {
      question: "Can I process multiple URLs at once?",
      answer: "Yes! Our bulk processing feature allows you to process up to 100 URLs simultaneously. You can export results in JSON or CSV format for easy analysis."
    },
    {
      question: "Is there an API available?",
      answer: "Yes, we provide a comprehensive REST API that allows you to integrate social preview generation directly into your applications. The API supports all platforms and includes bulk processing endpoints."
    },
    {
      question: "Is LinkGlimpse free to use?",
      answer: "Yes, LinkGlimpse is completely free to use. No registration is required and you can start generating social previews immediately at no cost."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <FAQStructuredData items={faqItems} />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="rounded-full border border-gray-200 bg-white p-2">
                <Image src="/images/link-icon.svg" alt="LinkGlimpse" width={42} height={42} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Link Preview Checker
              {' '}<span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">for Social Media</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-4">
              Check how any URL may appear on Facebook, X, LinkedIn and more. Preview social cards, inspect Open Graph tags, and find missing images or text.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
              Paste a public URL to get platform previews, an actionable diagnostic score, and a report you can hand directly to a developer.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mb-2 text-gray-500">
              <Facebook className="h-6 w-6 text-blue-600" />
              <Twitter className="h-6 w-6 text-blue-400" />
              <Linkedin className="h-6 w-6 text-blue-700" />
              <Instagram className="h-6 w-6 text-pink-600" />
              <MessageCircle className="h-6 w-6 text-blue-500" />
              <Users className="h-6 w-6 text-purple-600" />
              <Hash className="h-6 w-6 text-green-700" />
              <Search className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Preview Generator Section */}
        <div id="preview-generator" className="pb-16">
          <SocialPreview surface="homepage" />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Check Social Media Link Previews in One Place</h2>
            <p className="text-lg text-gray-600">Preview the card first, then inspect the metadata and technical signals behind it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Platform Navigation */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform-Specific Link Preview Tools</h2>
            <p className="text-lg text-gray-600">Check a representative preview and the metadata each platform can use.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <Link
                key={index}
                href={platform.path}
                className="group rounded-lg border border-gray-200 bg-white p-6 transition-colors duration-200 hover:border-gray-300"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg bg-gray-100 group-hover:bg-gray-200 transition-colors duration-200`}>
                      <platform.icon className={`h-6 w-6 ${platform.color}`} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        {platform.name}
                      </h3>
                      <p className="text-gray-600 text-sm">View specific preview</p>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <section className="bg-white py-8">
        {/* Bulk Processing Section */}
        <div className="py-8">
          <div className="mx-auto max-w-7xl rounded-lg border border-gray-200 bg-gradient-to-l from-blue-50 to-white p-8 transition-colors duration-200 hover:border-gray-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
                  <div className="rounded-xl border border-gray-200 bg-white p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk URL Checker Features</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">URLs per batch</span>
                        <span className="font-semibold text-blue-600">Up to 100</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Export formats</span>
                        <span className="font-semibold text-blue-600">JSON, CSV</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Processing speed</span>
                        <span className="font-semibold text-blue-600">~2 seconds per URL</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Diagnostic report</span>
                        <span className="font-semibold text-blue-600">Included</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-lg mr-4">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Bulk URL Metadata Checker</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Process up to 100 URLs at once with our bulk processing tool. Useful for agencies,
                  marketers, and content creators who need to optimize multiple pages simultaneously.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Batch processing up to 100 URLs</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Export results in JSON or CSV format</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Real-time progress tracking</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Error handling and retry logic</span>
                  </li>
                </ul>
                <Link
                  href="/bulk"
                  className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:from-blue-700 hover:to-indigo-700"
                >
                  Start Bulk Processing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* API Section */}
        <div className="py-8">
          <div className="mx-auto max-w-7xl rounded-lg border border-gray-200 bg-gradient-to-r from-green-50 to-white p-8 transition-colors duration-200 hover:border-gray-300">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-lg mr-4">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Open Graph Metadata API</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Integrate social preview generation directly into your applications with our comprehensive REST API.
                  Perfect for developers, agencies, and businesses that need programmatic access to our platform.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>RESTful API with JSON responses</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Structured metadata and diagnostic fields</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Open Graph, Twitter Card, image, and indexing diagnostics</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Bulk processing endpoints</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Comprehensive documentation</span>
                  </li>
                </ul>
                <Link
                  href="/api"
                  className="inline-flex items-center rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 font-semibold text-white transition-colors duration-200 hover:from-emerald-700 hover:to-teal-700"
                >
                  View API Documentation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl">
                <div className="rounded-xl border border-gray-200 bg-white p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">URL Metadata API Example</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Request:</p>
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                        <p>GET /api/metadata?url=https://example.com</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Response:</p>
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                        <p>{`{
    "title": "Example Page",
    "description": "A sample page for testing",
    "image": "https://example.com/image.jpg",
    "platforms": {
      "facebook": { ... },
      "twitter": { ... }
    }
  }`}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </section>


      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Metadata Diagnostics You Can Verify</h2>
            <p className="text-lg text-gray-600 mt-3">The report shows what was fetched and how every score was calculated.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: 'No invented success claims', text: 'Results come from the submitted page response and extracted tags—not a hidden popularity metric.' },
              { icon: Code, title: 'Raw inputs included', text: 'Inspect the exact metadata values used for the previews and platform-readiness checks.' },
              { icon: FileDown, title: 'Take the evidence with you', text: 'Copy or download the diagnostics report as JSON for QA, releases, or client work.' },
            ].map((item) => (
              <article key={item.title} className="bg-white border border-gray-200 rounded-xl p-6">
                <item.icon className="h-7 w-7 text-blue-600 mb-4" />
                <h3 className="font-semibold text-gray-900 text-lg">{item.title}</h3>
                <p className="text-gray-600 mt-2">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
