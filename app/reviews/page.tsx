import { getPostsByType } from '@/lib/posts';
import Link from 'next/link';

export default function ReviewsPage() {
  const posts = getPostsByType('review');

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-1.5 h-6 bg-green-500 rounded-full" />
        Reviews
      </h2>
      {posts.length === 0 ? (
        <p className="text-gray-500 italic">No reviews yet.</p>
      ) : (
        <div className="flex flex-col divide-y divide-gray-800">
          {posts.map((p) => (
            <Link key={p.slug} href={`/posts/${p.slug}`} className="group py-4 flex flex-col gap-1 hover:bg-gray-900 rounded-lg px-3 -mx-3 transition-colors">
              <p className="text-xs text-gray-500">
                {new Date(p.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <h3 className="text-white font-semibold group-hover:text-yellow-400 transition-colors">{p.title}</h3>
              {p.excerpt && <p className="text-gray-400 text-sm line-clamp-2">{p.excerpt}</p>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
