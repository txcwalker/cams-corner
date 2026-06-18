import { getMatches } from '@/lib/football';
import Link from 'next/link';

export const revalidate = 60;

type Match = {
  id: number;
  utcDate: string;
  status: string;
  stage: string;
  homeTeam: { name: string; shortName?: string };
  awayTeam: { name: string; shortName?: string };
  score: { fullTime: { home: number | null; away: number | null } };
};

function shortName(t: Match['homeTeam']) {
  return t.shortName ?? (t.name ?? 'TBD').split(' ').slice(-1)[0];
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ m?: string; y?: string }> }) {
  const params = await searchParams;
  const now = new Date();
  const year = parseInt(params.y ?? String(now.getFullYear()));
  const month = parseInt(params.m ?? String(now.getMonth())); // 0-indexed

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  let matches: Match[] = [];
  try {
    matches = await getMatches(
      firstDay.toISOString().slice(0, 10),
      lastDay.toISOString().slice(0, 10)
    );
  } catch {
    // handled below
  }

  // Group by date string YYYY-MM-DD
  const byDate: Record<string, Match[]> = {};
  for (const m of matches) {
    const d = m.utcDate.slice(0, 10);
    if (!byDate[d]) byDate[d] = [];
    byDate[d].push(m);
  }

  const daysInMonth = getDaysInMonth(year, month);
  const startDow = firstDay.getDay(); // 0=Sun
  const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7;

  const prevMonth = month === 0 ? { m: 11, y: year - 1 } : { m: month - 1, y: year };
  const nextMonth = month === 11 ? { m: 0, y: year + 1 } : { m: month + 1, y: year };

  const monthLabel = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const today = now.toISOString().slice(0, 10);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Match Calendar</h2>
        <div className="flex items-center gap-3">
          <Link
            href={`/calendar?m=${prevMonth.m}&y=${prevMonth.y}`}
            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm transition-colors"
          >
            ← Prev
          </Link>
          <span className="text-white font-semibold min-w-[140px] text-center">{monthLabel}</span>
          <Link
            href={`/calendar?m=${nextMonth.m}&y=${nextMonth.y}`}
            className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white text-sm transition-colors"
          >
            Next →
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-gray-700 rounded-lg overflow-hidden">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="bg-gray-900 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider py-2">
            {d}
          </div>
        ))}

        {Array.from({ length: totalCells }).map((_, i) => {
          const dayNum = i - startDow + 1;
          const isCurrentMonth = dayNum >= 1 && dayNum <= daysInMonth;
          const dateStr = isCurrentMonth
            ? `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`
            : '';
          const dayMatches = byDate[dateStr] ?? [];
          const isToday = dateStr === today;

          return (
            <div
              key={i}
              className={`bg-gray-900 min-h-[140px] p-2 ${!isCurrentMonth ? 'opacity-20' : ''}`}
            >
              {isCurrentMonth && (
                <>
                  <span className={`text-sm font-bold inline-flex items-center justify-center w-7 h-7 rounded-full mb-1.5 ${
                    isToday ? 'bg-yellow-400 text-gray-900' : 'text-gray-300'
                  }`}>
                    {dayNum}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {dayMatches.map((m) => {
                      const isFinished = m.status === 'FINISHED';
                      const isLive = m.status === 'IN_PLAY' || m.status === 'PAUSED';
                      const time = new Date(m.utcDate).toLocaleTimeString('en-US', {
                        timeZone: 'America/Chicago',
                        hour: 'numeric',
                        minute: '2-digit',
                      });
                      return (
                        <div
                          key={m.id}
                          className={`text-xs rounded px-1 py-0.5 ${
                            isLive ? 'bg-green-800 text-green-200' :
                            isFinished ? 'bg-gray-800 text-gray-300' :
                            'bg-blue-900 text-blue-300'
                          }`}
                          title={`${m.homeTeam.name} vs ${m.awayTeam.name}`}
                        >
                          {isFinished || isLive
                            ? `${shortName(m.homeTeam)} ${m.score.fullTime.home ?? 0}–${m.score.fullTime.away ?? 0} ${shortName(m.awayTeam)}`
                            : `${time} ${shortName(m.homeTeam)} v ${shortName(m.awayTeam)}`}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <p className="text-xs text-gray-600 mt-3 text-right">
        * All kickoff times shown in Central Standard Time (CST)
      </p>
    </div>
  );
}
