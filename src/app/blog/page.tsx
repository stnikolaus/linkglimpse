import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { getAllBlogPosts, getFeaturedBlogPosts } from '@/lib/blog';
import BlogListStructuredData from '@/components/BlogListStructuredData';

export const metadata: Metadata = {
  title: 'Open Graph & Social Preview Guides',
  description: 'Practical guides to Open Graph tags, social preview images, Twitter Cards and link debugging. Learn what to implement, test and fix.',
  keywords: 'social media marketing, SEO tips, content optimization, social media strategy, digital marketing blog',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Open Graph & Social Preview Guides',
    description: 'Practical guides to Open Graph tags, social preview images, Twitter Cards and link debugging. Learn what to implement, test and fix.',
    type: 'website',
    url: '/blog',
    images: ['/images/icon/social-preview.jpeg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Open Graph & Social Preview Guides',
    description: 'Practical guides to Open Graph tags, social preview images, Twitter Cards and link debugging. Learn what to implement, test and fix.',
    images: ['/images/icon/social-preview.jpeg'],
  },
};

export default function BlogPage() {
  const allPosts = getAllBlogPosts();
  const featuredPosts = getFeaturedBlogPosts();
  const featuredPost = featuredPosts[0] || allPosts[0];
  const otherPosts = allPosts.filter(post => post.slug !== featuredPost?.slug).slice(0, 6);

  return (
    <>
      <BlogListStructuredData posts={allPosts} baseUrl="https://www.linkglimpse.com" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Open Graph &amp; <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Social Preview Guides</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Practical guides to Open Graph tags, social preview images, Twitter Cards and link debugging. Learn what to implement, test and fix.
            </p>
          </div>

          {/* Featured Post */}
          <div className="mb-16">
            <Link href={`/blog/${featuredPost.slug}`} className="block">
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    {featuredPost.image ? (
                      <div className="h-64 md:h-full relative overflow-hidden">
                        <Image
                          src={featuredPost.image}
                          alt={featuredPost.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    ) : (
                      <div className="h-64 md:h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                        <div className="text-center text-white p-8">
                          <p className="text-2xl font-bold mb-4">Featured Open Graph Guide</p>
                          <p className="text-lg opacity-90">Latest insights and strategies</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                        {featuredPost.category}
                      </span>
                      <span className="text-gray-500 text-sm ml-4 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(featuredPost.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {featuredPost.title}
                    </h2>
                    <p className="text-gray-600 mb-6">
                      {featuredPost.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      {featuredPost.author}
                      <Clock className="h-4 w-4 ml-4 mr-1" />
                      {featuredPost.readTime}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {otherPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block">
                <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                  {post.image ? (
                    <div className="h-48 relative overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-600">
                        <Tag className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">Blog Image</p>
                      </div>
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                        {post.category}
                      </span>
                      <span className="text-gray-500 text-sm ml-4 flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.date).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {post.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="h-4 w-4 mr-1" />
                      {post.author}
                      <Clock className="h-4 w-4 ml-4 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
