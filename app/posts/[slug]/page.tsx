import { getPost, getAllPosts } from '@/lib/posts';
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';
import Link from 'next/link';

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const processed = await remark().use(html).process(post.content);
  const contentHtml = processed.toString();

  const isPreview = post.type === 'preview';

  return (
    <div className="max-w-3xl mx-auto">
      <Link href="/" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">← Back to home</Link>
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${isPreview ? 'bg-blue-600 text-white' : 'bg-green-700 text-white'}`}>
          {isPreview ? 'PREVIEW' : 'REVIEW'}
        </span>
        <span className="text-gray-400 text-sm">
          {new Date(post.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>
      <h1 className="text-3xl font-bold text-white mb-1">{post.title}</h1>
      {post.match && <p className="text-yellow-400 font-medium mb-6">{post.match}</p>}
      <article
        className="prose prose-invert prose-yellow max-w-none"
        dangerouslySetInnerHTML={{ __html: contentHtml }}
      />
    </div>
  );
}
