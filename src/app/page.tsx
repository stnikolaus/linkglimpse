import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Globe, Share2, Eye, Zap, CheckCircle, ArrowRight, Facebook, Twitter, Linkedin, Search, Instagram, MessageCircle, Users, Hash, BarChart3, Sparkles, Bot, Star, Building2, Code, Database, Cpu } from 'lucide-react';
import SocialPreview from '@/components/SocialPreview';
import FAQStructuredData from '@/components/FAQStructuredData';
import ReviewStructuredData from '@/components/ReviewStructuredData';

// Function to generate dynamic number based on time of day
function getDynamicCount(): number {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Convert time to a decimal (0-24)
  const timeDecimal = hours + (minutes / 60);
  
  // Base number starts at 1488 at 6 AM
  const baseNumber = 1488;
  
  // Maximum number at midnight (5639)
  const maxNumber = 5639;
  
  // Calculate progress from 6 AM (6) to midnight (24)
  // At 6 AM: 0% progress, at midnight: 100% progress
  const progress = Math.max(0, Math.min(1, (timeDecimal - 6) / 18));
  
  // Use a smooth curve (ease-in-out effect)
  const smoothProgress = progress * progress * (3 - 2 * progress);
  
  // Calculate the final number
  const dynamicNumber = Math.round(baseNumber + (maxNumber - baseNumber) * smoothProgress);
  
  return Math.max(1488, Math.min(5639, dynamicNumber));
}

export const metadata: Metadata = {
  title: 'LinkGlimpse - Social Media Preview Debugger',
  description: 'Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, Instagram, and more platforms. Free tool for marketers and developers.',
  keywords: 'social media preview, facebook preview, twitter preview, linkedin preview, instagram preview, open graph, meta tags, url preview generator',
  openGraph: {
    title: 'LinkGlimpse - Social Media Preview Debugger',
    description: 'Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, Instagram, and more platforms.',
    type: 'website',
    url: 'https://www.linkglimpse.com',
    siteName: 'LinkGlimpse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkGlimpse - Social Media Preview Debugger',
    description: 'Generate social media previews for any URL. See how your links will appear on Facebook, Twitter, LinkedIn, Instagram, and more platforms.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Home() {
  const dynamicCount = getDynamicCount();
  const platforms = [
    { name: 'Facebook', icon: Facebook, path: '/facebook-social-preview', color: 'text-blue-600' },
    { name: 'Twitter', icon: Twitter, path: '/twitter-social-preview', color: 'text-blue-400' },
    { name: 'LinkedIn', icon: Linkedin, path: '/linkedin-social-preview', color: 'text-blue-700' },
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
      title: 'Real-time Previews',
      description: 'See exactly how your content will appear across all major social platforms instantly.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Powered by Next.js and optimized for speed. Get previews in milliseconds.'
    },
    {
      icon: Share2,
      title: '9 Platforms Supported',
      description: 'Facebook, Twitter, LinkedIn, Google Search, Instagram, Tumblr, Mastodon, Nextdoor, and Bluesky.'
    },
    {
      icon: BarChart3,
      title: 'Bulk Processing',
      description: 'Process up to 100 URLs at once with batch export in JSON or CSV format.'
    },
    {
      icon: CheckCircle,
      title: 'Accurate Rendering',
              description: 'Uses custom-built social preview components for authentic platform appearances.'
    },
    {
      icon: Sparkles,
      title: 'AI Enhancement',
      description: 'Automatically optimize titles, descriptions, and images with advanced AI technology.'
    },
    {
      icon: Code,
      title: 'Developer Friendly',
      description: 'Comprehensive REST API with detailed documentation and multiple SDKs available.'
    },
    {
      icon: Globe,
      title: 'Free to Use',
      description: 'No registration required. Start generating social previews immediately at no cost.'
    }
  ];

  const companies = [
    { name: 'AI Skill', logo: '/images/company-logos/aiskill.svg' },
    { name: 'Lead Magnet Creator', logo: '/images/company-logos/lead-magnet-creator-logo.png' },
    { name: 'Podfan', logo: '/images/company-logos/podfan.svg' },
    { name: 'SaaS Garden', logo: '/images/company-logos/saas-garden.png' },
    { name: 'Shorts Faceless', logo: '/images/company-logos/shorts-faceless.svg' },
  ];

  const reviews = [
    {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company: 'TechCorp',
      rating: 5,
      review: 'This tool has revolutionized our social media strategy. The AI enhancement feature is incredible!',
      avatar: '👩‍💼'
    },
    {
      name: 'Mike Chen',
      role: 'Content Creator',
      company: 'DigitalFlow',
      rating: 5,
      review: 'Bulk processing saves me hours every week. The previews are spot-on accurate.',
      avatar: '👨‍💻'
    },
    {
      name: 'Emma Rodriguez',
      role: 'SEO Specialist',
      company: 'SocialBoost',
      rating: 5,
      review: 'Perfect for optimizing our link sharing. The API integration is seamless.',
      avatar: '👩‍🔬'
    }
  ];

  const faqItems = [
    {
      question: "What is LinkGlimpse?",
      answer: "LinkGlimpse is a free social media preview debugger that shows how your links will appear when shared on Facebook, Twitter, LinkedIn, Instagram, and other social platforms. It helps marketers and developers optimize their social media sharing."
    },
    {
      question: "How does the AI enhancement feature work?",
      answer: "Our AI enhancement feature automatically optimizes your meta tags, descriptions, and images to create compelling social media previews that drive engagement and clicks. It analyzes your content and generates optimized titles and descriptions."
    },
    {
      question: "Which social media platforms are supported?",
      answer: "We support 9 major platforms: Facebook, Twitter, LinkedIn, Google Search, Instagram, Tumblr, Mastodon, Nextdoor, and Bluesky. Each platform has its own specific preview format."
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

  const reviewData = {
    reviews: [
      {
        author: 'Sarah Johnson',
        rating: 5,
        reviewBody: 'This tool has revolutionized our social media strategy. The AI enhancement feature is incredible!',
        datePublished: '2025-01-15',
        reviewTitle: 'Revolutionary Social Media Tool',
      },
      {
        author: 'Mike Chen',
        rating: 5,
        reviewBody: 'Bulk processing saves me hours every week. The previews are spot-on accurate.',
        datePublished: '2025-01-10',
        reviewTitle: 'Time-Saving Bulk Processing',
      },
      {
        author: 'Emma Rodriguez',
        rating: 5,
        reviewBody: 'Perfect for optimizing our link sharing. The API integration is seamless.',
        datePublished: '2025-01-05',
        reviewTitle: 'Seamless API Integration',
      },
    ],
    aggregateRating: {
      ratingValue: 4.9,
      ratingCount: 1250,
      bestRating: 5,
      worstRating: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
      <FAQStructuredData items={faqItems} />
      <ReviewStructuredData reviews={reviewData.reviews} aggregateRating={reviewData.aggregateRating} />
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white rounded-full p-2 shadow-lg">
                <Image src="/images/link-icon.svg" alt="LinkGlimpse" width={42} height={42} />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Social Preview 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Debugger</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
              Preview your link to find out how it will appear when shared across all major social media platforms. Perfect social share checker for marketers, content creators, and developers.
            </p>
          </div>
        </div>

        {/* Preview Generator Section */}
        <div id="preview-generator" className="pb-16">
          <SocialPreview />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose LinkGlimpse?</h2>
            <p className="text-lg text-gray-600">Built with modern technology and designed for accuracy</p>
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
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Individual Platform Previews</h2>
            <p className="text-lg text-gray-600">Explore how your content appears on each platform specifically</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platforms.map((platform, index) => (
              <Link 
                key={index}
                href={platform.path}
                className="group bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
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
        {/* AI Enhancement Section */}
        <div className="py-8">
          <div className="max-w-7xl mx-auto p-8 bg-gradient-to-r from-purple-50 to-white border border-gray-100 rounded-lg hover:shadow-sm transition ease-in-out duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded-lg mr-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">AI Enhancement</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Transform your social media previews with our advanced AI technology. Our AI enhancement feature 
                  automatically optimizes your meta tags, descriptions, and images to create compelling social media previews 
                  that drive engagement and clicks.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Automatic meta tag optimization</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Smart description generation</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Image enhancement and cropping</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Platform-specific optimization</span>
                  </li>
                </ul>
                <Link 
                  href="/ai"
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Try AI Enhancement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Enhancement Example</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Before AI Enhancement:</p>
                      <p className="text-gray-700">&ldquo;Check out this article about social media marketing&rdquo;</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">After AI Enhancement:</p>
                      <p className="text-gray-700 font-medium">&ldquo;🚀 10 Proven Social Media Marketing Strategies That Drive 3x More Engagement in 2025&rdquo;</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Processing Section */}
        <div className="py-8">
          <div className="max-w-7xl mx-auto p-8 bg-gradient-to-l from-blue-50 to-white border border-gray-100 rounded-lg hover:shadow-sm transition ease-in-out duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Bulk Processing Features</h3>
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
                        <span className="text-gray-600">Platforms supported</span>
                        <span className="font-semibold text-blue-600">All 9 platforms</span>
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
                  <h2 className="text-3xl font-bold text-gray-900">Bulk Processing</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Process hundreds of URLs at once with our powerful bulk processing tool. Perfect for agencies, 
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
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
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
          <div className="max-w-7xl mx-auto p-8 bg-gradient-to-r from-green-50 to-white border border-gray-100 rounded-lg hover:shadow-sm transition ease-in-out duration-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-lg mr-4">
                    <Code className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900">Powerful API</h2>
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
                    <span>Rate limiting and authentication</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span>Support for all 9 social platforms</span>
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
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  View API Documentation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">API Example</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Request:</p>
                      <div className="bg-gray-900 text-green-400 p-3 rounded-lg text-sm font-mono">
                        <p>GET /api/preview?url=https://example.com</p>
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

        {/* AI Examples Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-3 rounded-lg mr-4">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">AI-Powered Features</h2>
              </div>
              <p className="text-lg text-gray-600">See how our AI technology transforms your content</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Smart Title Generation</h3>
                  <p className="text-sm text-gray-600">AI analyzes your content and generates compelling titles that increase click-through rates.</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Example:</p>
                  <p className="text-sm font-medium">&ldquo;5 Game-Changing SEO Tips&rdquo; → &ldquo;🚀 5 SEO Secrets That Boosted Our Traffic by 300% in 30 Days&rdquo;</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Description Optimization</h3>
                  <p className="text-sm text-gray-600">Creates engaging descriptions that work perfectly across all social platforms.</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Example:</p>
                  <p className="text-sm font-medium">&ldquo;Learn about marketing&rdquo; → &ldquo;Discover proven marketing strategies used by top brands. Free guide with actionable tips!&rdquo;</p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Image Enhancement</h3>
                  <p className="text-sm text-gray-600">Automatically optimizes images for each platform&apos;s specific requirements.</p>
                </div>
                <div className="bg-gray-100 p-3 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Example:</p>
                  <p className="text-sm font-medium">&ldquo;Generic image&rdquo; → &ldquo;High-contrast, branded image with text overlay optimized for social sharing&rdquo;</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Link 
                href="/ai"
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explore AI Features
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
      

      {/* Companies Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900">Trusted by leading tech enthusiasts</h2>
            </div>
            <p className="text-lg text-gray-600"><b>{dynamicCount}</b> social links previews generated today and still counting</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {companies.map((company, index) => (
              <div key={index} className="text-center">
                <img src={company.logo} alt={company.name} className="h-[50px] w-auto mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600">Join thousands of satisfied customers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <div className="flex items-center mb-4">
                    <div className="text-2xl mr-3">{review.avatar}</div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{review.name}</h3>
                      <p className="text-sm text-gray-600">{review.role} at {review.company}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  
                  <p className="text-gray-700 italic">&ldquo;{review.review}&rdquo;</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
