'use client';

import { useEffect, useState } from 'react';

type Match = {
  id: number;
  status: string;
  utcDate: string;
  homeTeam: { name: string; shortName?: string };
  awayTeam: { name: string; shortName?: string };
  score: { fullTime: { home: number | null; away: number | null } };
};

const TZ = 'America/Chicago';

function toCentralDateStr(utcDate: string): string {
  return new Date(utcDate).toLocaleDateString('en-CA', { timeZone: TZ });
}

function getCentralToday(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ });
}

function getCentralYesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA', { timeZone: TZ });
}

function getCentralTomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return d.toLocaleDateString('en-CA', { timeZone: TZ });
}

function teamName(t: Match['homeTeam']) {
  return t.shortName ?? t.name.split(' ').pop() ?? t.name;
}

function ScoreChip({ match }: { match: Match }) {
  const isLive = match.status === 'IN_PLAY' || match.status === 'PAUSED';
  const isFinished = match.status === 'FINISHED';
  const isScheduled = match.status === 'TIMED' || match.status === 'SCHEDULED';
  const time = new Date(match.utcDate).toLocaleTimeString('en-US', { timeZone: TZ, hour: 'numeric', minute: '2-digit' });

  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-gray-800 border border-gray-700 whitespace-nowrap text-sm">
      {isLive && <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />}
      <span className="text-gray-300">{teamName(match.homeTeam)}</span>
      <span className={`font-bold ${isLive ? 'text-green-400' : isFinished ? 'text-white' : 'text-gray-500'}`}>
        {isFinished || isLive
          ? `${match.score.fullTime.home ?? 0}–${match.score.fullTime.away ?? 0}`
          : isScheduled ? time : '–'}
      </span>
      <span className="text-gray-300">{teamName(match.awayTeam)}</span>
    </span>
  );
}

export default function ScoresBar({ matches: initialMatches }: { matches: Match[] }) {
  const [matches, setMatches] = useState(initialMatches);

  // Poll every 5 minutes if any match is live
  useEffect(() => {
    const hasLive = matches.some(
      (m) => m.status === 'IN_PLAY' || m.status === 'PAUSED'
    );
    if (!hasLive) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/matches?type=bar');
        if (res.ok) setMatches(await res.json());
      } catch {}
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [matches]);

  if (!matches.length) return null;

  const today = getCentralToday();
  const yesterday = getCentralYesterday();
  const tomorrow = getCentralTomorrow();

  const yesterdayMatches = matches.filter((m) => toCentralDateStr(m.utcDate) === yesterday);
  const todayMatches = matches.filter((m) => toCentralDateStr(m.utcDate) === today);
  const upcomingMatches = matches.filter((m) => toCentralDateStr(m.utcDate) === tomorrow);

  if (!yesterdayMatches.length && !todayMatches.length && !upcomingMatches.length) return null;

  return (
    <div className="bg-gray-900 border-b border-gray-700 px-4 py-2 overflow-x-auto scrollbar-none">
      <div className="flex items-center gap-2 min-w-max">

        {/* Yesterday — only on xl+ screens */}
        {yesterdayMatches.length > 0 && (
          <div className="hidden xl:contents">
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider pr-1 shrink-0">Yesterday</span>
            {yesterdayMatches.map((m) => <ScoreChip key={m.id} match={m} />)}
            {(todayMatches.length > 0 || upcomingMatches.length > 0) && (
              <span className="text-gray-700 px-2 shrink-0">|</span>
            )}
          </div>
        )}

        {/* Today — always visible */}
        {todayMatches.length > 0 && (
          <>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider pr-1 shrink-0">Today</span>
            {todayMatches.map((m) => <ScoreChip key={m.id} match={m} />)}
            {upcomingMatches.length > 0 && <span className="text-gray-700 px-2 shrink-0">|</span>}
          </>
        )}

        {/* Tomorrow — always visible */}
        {upcomingMatches.length > 0 && (
          <>
            <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider pr-1 shrink-0">Tomorrow</span>
            {upcomingMatches.map((m) => <ScoreChip key={m.id} match={m} />)}
          </>
        )}

      </div>
    </div>
  );
}
