import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDir = path.join(process.cwd(), 'posts');

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  type: 'preview' | 'review';
  match?: string;
  excerpt?: string;
  // Optional map of "Home vs Away" → "Stadium, City" for venue display on match cards
  venues?: Record<string, string>;
};

export type Post = PostMeta & { content: string };

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDir)) return [];
  return fs
    .readdirSync(postsDir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const slug = f.replace(/\.md$/, '');
      const { data } = matter(fs.readFileSync(path.join(postsDir, f), 'utf8'));
      return { slug, ...data } as PostMeta;
    })
    .sort((a, b) => {
      if (a.date !== b.date) return a.date < b.date ? 1 : -1;
      // Same date: reviews before previews (reviews are written after the fact)
      if (a.type !== b.type) return a.type === 'review' ? -1 : 1;
      return 0;
    });
}

export function getPost(slug: string): Post | null {
  const file = path.join(postsDir, `${slug}.md`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  return { slug, ...data, content } as Post;
}

export function getPostsByType(type: 'preview' | 'review') {
  return getAllPosts().filter((p) => p.type === type);
}
