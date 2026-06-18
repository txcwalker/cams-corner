import Link from 'next/link';
import type { PostMeta } from '@/lib/posts';

export default function PostCard({ post }: { post: PostMeta }) {
  const isPreview = post.type === 'preview';
  return (
    <Link href={`/posts/${post.slug}`} className="block bg-gray-800 rounded-lg p-3 hover:bg-gray-700 transition-colors">
      <div className="flex items-center gap-2 mb-1">
        <span className={`text-xs font-bold px-2 py-0.5 rounded ${isPreview ? 'bg-blue-600 text-white' : 'bg-green-700 text-white'}`}>
          {isPreview ? 'PREVIEW' : 'REVIEW'}
        </span>
        <span className="text-gray-400 text-xs">{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
      </div>
      <h3 className="text-white font-semibold text-sm leading-snug">{post.title}</h3>
      {post.match && <p className="text-gray-400 text-xs mt-0.5">{post.match}</p>}
      {post.excerpt && <p className="text-gray-400 text-xs mt-1 line-clamp-2">{post.excerpt}</p>}
    </Link>
  );
}
