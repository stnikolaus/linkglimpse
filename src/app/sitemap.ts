import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/lib/blog';
import { SITE_URL } from '@/lib/seo';
import { exampleReports } from '@/lib/example-reports';

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/open-graph-checker`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/compare`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/examples`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/twitter-card-validator`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/linkedin-post-preview`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/facebook-open-graph-debugger`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/bulk`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/api`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/instagram-social-preview`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/google-search-preview`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/tumblr-social-preview`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/mastodon-social-preview`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/nextdoor-social-preview`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/bluesky-social-preview`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
  ];
  const posts: MetadataRoute.Sitemap = getAllBlogPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updated || post.date),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
  const examples: MetadataRoute.Sitemap = exampleReports.map((example) => ({
    url: `${SITE_URL}/examples/${example.slug}`,
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  return [...pages, ...posts, ...examples];
}
