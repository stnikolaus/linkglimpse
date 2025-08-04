import Link from 'next/link';
import Image from 'next/image';
import { getAllBlogPosts } from '@/lib/blog';

const socialPreviews = [
  { name: 'Facebook', href: '/facebook-social-preview' },
  { name: 'Twitter', href: '/twitter-social-preview' },
  { name: 'LinkedIn', href: '/linkedin-social-preview' },
  { name: 'Instagram', href: '/instagram-social-preview' },
  { name: 'Mastodon', href: '/mastodon-social-preview' },
  { name: 'Tumblr', href: '/tumblr-social-preview' },
  { name: 'Bluesky', href: '/bluesky-social-preview' },
  { name: 'Nextdoor', href: '/nextdoor-social-preview' },
  { name: 'Google Search', href: '/google-search-preview' },
];

export default function Footer() {
  // Get the latest 5 blog posts
  const latestBlogPosts = getAllBlogPosts().slice(0, 5);

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Social Previews Column */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Social Previews
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2">
              {socialPreviews.map((preview) => (
                <Link
                  key={preview.href}
                  href={preview.href}
                  className="block text-sm text-gray-400 hover:text-gray-200"
                >
                  {preview.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Tools & Resources Column */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Tools & Resources
            </h3>
            <div className="space-y-2">
              <Link
                href="/ai"
                className="block text-sm text-gray-400 hover:text-gray-200"
              >
                AI Enhancement
              </Link>
              <Link
                href="/api"
                className="block text-sm text-gray-400 hover:text-gray-200"
              >
                API Documentation
              </Link>
              <Link
                href="/bulk"
                className="block text-sm text-gray-400 hover:text-gray-200"
              >
                Bulk Processing
              </Link>
              <Link
                href="/blog"
                className="block text-sm text-gray-400 hover:text-gray-200"
              >
                Blog
              </Link>
            </div>
          </div>

          {/* Latest Blog Posts Column */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase mb-4">
              Latest Posts
            </h3>
            <div className="space-y-2">
              {latestBlogPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block text-sm text-gray-400 hover:text-gray-200 truncate"
                  title={post.title}
                >
                  {post.title}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Credits */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="text-center flex flex-row items-center justify-between gap-2">
            <p className="text-sm text-gray-400 flex items-center justify-center gap-1">
              Made in{' '}
              <a
                href="https://www.tetriz.io/"
                target="_blank"
                className="text-blue-200 hover:text-blue-400 font-medium inline-flex items-center gap-1"
              >
                <Image src="/images/tetriz-favicon-16x16.png" alt="Tetriz.io" width={12} height={12} />
                Tetriz.io
              </a>{' '}
              by{' '}
              <a
                href="https://x.com/ichangetheway"
                target="_blank"
                className="text-blue-200 hover:text-blue-400 font-medium"
              >
                Ivan
              </a>
            </p>
            <Link
                href="/privacy"
                className="block text-sm text-gray-400 hover:text-gray-200"
              >
                Privacy Policy
              </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 