import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { compareDesc } from 'date-fns';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  updated?: string;
  author: string;
  category: string;
  tags: string[];
  readTime: string;
  image?: string;
  featured?: boolean;
  content: string;
  html: string;
}

export function getAllBlogPosts(): BlogPost[] {
  // Check if the directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      // Remove ".md" from file name to get slug
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      return {
        slug,
        content: matterResult.content,
        ...matterResult.data,
      } as BlogPost;
    });

  // Sort posts by date
  return allPostsData.sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(gfm)
      .use(html)
      .process(matterResult.content);
    const contentHtml = processedContent.toString();

    return {
      slug,
      content: matterResult.content,
      html: contentHtml,
      ...matterResult.data,
    } as BlogPost;
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error);
    return null;
  }
}

export function getFeaturedBlogPosts(): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter((post) => post.featured).sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter((post) => post.category === category).sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
}

export function getBlogPostsByTag(tag: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter((post) => post.tags.includes(tag)).sort((a, b) => compareDesc(new Date(a.date), new Date(b.date)));
}

export function getAllCategories(): string[] {
  const allPosts = getAllBlogPosts();
  const categories = allPosts.map((post) => post.category);
  return [...new Set(categories)];
}

export function getAllTags(): string[] {
  const allPosts = getAllBlogPosts();
  const tags = allPosts.flatMap((post) => post.tags);
  return [...new Set(tags)];
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts
    .filter((post) => post.slug !== currentSlug)
    .slice(0, limit);
}
