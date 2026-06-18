import { getMatches } from '@/lib/football';
import { getPostsByType, getPost, type Post } from '@/lib/posts';
import ArticleWithCards from '@/components/ArticleWithCards';
import Link from 'next/link';

export const revalidate = 60;


type ApiMatch = { id: number; utcDate: string; status: string; homeTeam: { name: string }; awayTeam: { name: string }; score: { fullTime: { home: number | null; away: number | null } }; stage: string; group?: string };

async function getMatchesForPost(post: Post): Promise<ApiMatch[]> {
  try {
    // Fetch ±1 day: early UTC games land the day before, late games (8pm CT) land the day after
    const base = new Date(post.date + 'T12:00:00');
    const prev = new Date(base); prev.setDate(prev.getDate() - 1);
    const next = new Date(base); next.setDate(next.getDate() + 1);
    return await getMatches(prev.toISOString().slice(0, 10), next.toISOString().slice(0, 10));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const reviews = getPostsByType('review');
  const previews = getPostsByType('preview');

  const latestReview = reviews[0] ? getPost(reviews[0].slug) : null;
  const latestPreview = previews[0] ? getPost(previews[0].slug) : null;

  const [reviewMatches, previewMatches] = await Promise.all([
    latestReview ? getMatchesForPost(latestReview) : [],
    latestPreview ? getMatchesForPost(latestPreview) : [],
  ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* LEFT — Latest Review */}
      <section className="min-w-0">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-green-800">
          <span className="w-1 h-5 bg-green-500 rounded-full" />
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-widest">Review</h2>
        </div>

        {latestReview ? (
          <article>
            <p className="text-gray-500 text-xs mb-1">
              {new Date(latestReview.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h3 className="text-xl font-bold text-white mb-4 leading-snug">{latestReview.title}</h3>

            <ArticleWithCards
              content={latestReview.content}
              matches={reviewMatches}
              venues={latestReview.venues}
            />

            {reviews.length > 1 && (
              <div className="mt-6 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Earlier Reviews</p>
                {reviews.slice(1, 4).map((p) => (
                  <Link key={p.slug} href={`/posts/${p.slug}`} className="block py-1.5 text-sm text-gray-400 hover:text-white border-b border-gray-800 truncate">
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </article>
        ) : (
          <p className="text-gray-600 text-sm italic">No reviews posted yet.</p>
        )}
      </section>

      {/* CENTER — Latest Preview */}
      <section className="min-w-0">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-blue-800">
          <span className="w-1 h-5 bg-blue-500 rounded-full" />
          <h2 className="text-sm font-bold text-blue-400 uppercase tracking-widest">Preview</h2>
        </div>

        {latestPreview ? (
          <article>
            <p className="text-gray-500 text-xs mb-1">
              {new Date(latestPreview.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
            <h3 className="text-xl font-bold text-white mb-4 leading-snug">{latestPreview.title}</h3>

            <ArticleWithCards
              content={latestPreview.content}
              matches={previewMatches}
              venues={latestPreview.venues}
            />

            {previews.length > 1 && (
              <div className="mt-6 pt-4 border-t border-gray-800">
                <p className="text-xs text-gray-600 uppercase tracking-wider mb-2">Earlier Previews</p>
                {previews.slice(1, 4).map((p) => (
                  <Link key={p.slug} href={`/posts/${p.slug}`} className="block py-1.5 text-sm text-gray-400 hover:text-white border-b border-gray-800 truncate">
                    {p.title}
                  </Link>
                ))}
              </div>
            )}
          </article>
        ) : (
          <p className="text-gray-600 text-sm italic">No previews posted yet.</p>
        )}
      </section>

    </div>
  );
}
