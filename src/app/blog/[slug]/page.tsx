import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug, getAllBlogPosts, getRelatedPosts } from '@/lib/blog';
import { format } from 'date-fns';
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, BookOpen } from 'lucide-react';
import Link from 'next/link';
import BlogStructuredData from '@/components/BlogStructuredData';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  return {
    title: `${post.title} | LinkGlimpse Blog`,
    description: post.description,
    keywords: post.tags.join(', '),
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  // Get related posts (excluding current post)
  const relatedPosts = getRelatedPosts(slug, 3);

  return (
    <>
      <BlogStructuredData
        title={post.title}
        description={post.description}
        url={`https://www.linkglimpse.com/blog/${post.slug}`}
        author={post.author}
        datePublished={post.date}
        category={post.category}
        tags={post.tags}
        readTime={post.readTime}
        featured={post.featured}
      />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 w-full h-1 bg-gray-200 z-50">
          <div className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300" 
               style={{ width: '0%' }} 
               id="reading-progress"></div>
        </div>

        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Back to Blog */}
            <div className="mb-8">
              <Link 
                href="/blog"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
              >
                <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Blog
              </Link>
            </div>

            {/* Article Header */}
            <article className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
              {/* Hero Image */}
              {post.image ? (
                <div className="h-64 md:h-96 relative overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20"></div>
                </div>
              ) : (
                <div className="h-64 md:h-96 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="text-center text-white p-8 relative z-10">
                    <div className="flex items-center justify-center mb-4">
                      <BookOpen className="h-8 w-8 mr-3" />
                      <span className="text-lg font-medium">Blog Post</span>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold mb-2">{post.title}</h1>
                    <p className="text-lg opacity-90">{post.description}</p>
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="p-8 md:p-12">
                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    {format(new Date(post.date), 'MMMM dd, yyyy')}
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-green-500" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-orange-500" />
                    {post.readTime}
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 mr-2 text-purple-500" />
                    {post.category}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                  {post.title}
                </h1>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-10">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1.5 rounded-full border border-blue-200 hover:bg-blue-200 transition-colors duration-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Article Body */}
                <div className="prose prose-lg max-w-none">
                  <div 
                    className="markdown-content"
                    dangerouslySetInnerHTML={{ __html: post.html }}
                  />
                </div>

                {/* Article Footer */}
                <div className="mt-16 pt-8 border-t border-gray-200">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      <p className="font-medium">Written by {post.author}</p>
                      <p>Published on {format(new Date(post.date), 'MMMM dd, yyyy')}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="inline-flex items-center text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </button>
                      <Link 
                        href="/blog"
                        className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200 group"
                      >
                        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                        Back to Blog
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {/* Related Posts Section */}
            <div className="mt-12">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Posts</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {relatedPosts.length > 0 ? (
                    relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        href={`/blog/${relatedPost.slug}`}
                        className="group block bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all duration-200 hover:shadow-md"
                      >
                        <div className="mb-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Calendar className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">
                              {format(new Date(relatedPost.date), 'MMM dd, yyyy')}
                            </span>
                          </div>
                          <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                            {relatedPost.title}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-3">
                            {relatedPost.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <User className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">{relatedPost.author}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-xs text-gray-500">{relatedPost.readTime}</span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full">
                      <div className="bg-gray-50 rounded-lg p-6 text-center">
                        <h3 className="font-semibold text-gray-900 mb-2">No related posts yet</h3>
                        <p className="text-sm text-gray-600">Check back soon for more great content!</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reading Progress Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('scroll', () => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.body.offsetHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                const progressBar = document.getElementById('reading-progress');
                if (progressBar) {
                  progressBar.style.width = scrollPercent + '%';
                }
              });
            `,
          }}
        />
      </div>
    </>
  );
} 